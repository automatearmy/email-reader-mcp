import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { imapClient } from "../../imap/index.js";
import { GetMessagesInput } from "./schema.js";
import { simpleParser } from "mailparser";
import { MessageEnvelopeObject, SearchObject } from "imapflow";

interface EmailMessage {
  uid: number;
  subject: string;
  from: string;
  date: string;
  body: string;
  to?: string;
}

export async function getMessagesHandler(args: GetMessagesInput): Promise<CallToolResult> {
  let imap;
  let lock;

  try {
    const userEmail = process.env.USER_EMAIL;
    const userPass = process.env.USER_PASS;
    if (!userEmail || !userPass) {
      throw new Error("USER_EMAIL and USER_PASS environment variables are required");
    }

    imap = imapClient({
      user: userEmail,
      pass: userPass,
    });

    await imap.connect();
    lock = await imap.getMailboxLock("INBOX");
    const searchCriteria: SearchObject = {};
    if (args.unreadOnly) {
      searchCriteria.seen = false;
    }

    if (args.dateFrom) {
      searchCriteria.since = new Date(args.dateFrom);
    }

    if (args.dateTo) {
      searchCriteria.before = new Date(args.dateTo);
    }

    if (args.from) {
      searchCriteria.from = args.from;
    }

    if (args.subject) {
      searchCriteria.subject = args.subject;
    }

    const messagesSearch = await imap.search(searchCriteria);
    if (!messagesSearch) {
      lock.release();
      await imap.logout();
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                messages: [],
                count: 0,
                message: "No messages found matching the criteria",
              },
              null,
              2
            ),
          },
        ],
      };
    }
    const emailMessages: EmailMessage[] = [];
    const sequencialStrings = messagesSearch
      .slice(-args.limit! || 0)
      .map((m) => m.toString())
      .join(",");
    for await (const msg of imap.fetch(`${sequencialStrings}`, {
      envelope: true,
      bodyStructure: true,
      bodyParts: ["text"],
    })) {
      try {
        const bodyPartsMap = msg?.bodyParts;
        const text = bodyPartsMap?.get("text");
        let bodyContent: string = "";
        if (text) {
          const emailRaw = await simpleParser(text);
          bodyContent = emailRaw?.text?.replace(/<[^>]*>/g, "") || "";
        }
        const { subject, from, to, date } = msg.envelope as MessageEnvelopeObject;
        const emailMsg: EmailMessage = {
          uid: msg.uid,
          subject: subject || "(No Subject)",
          from: from?.map(({ address }) => `${address}`).join(",") || "Unknown",
          to: to?.map(({ address }) => `${address}`).join(",") || "Unknown",
          date: date?.toISOString() || new Date().toISOString(),
          body: args.includeFullContent
            ? bodyContent
            : bodyContent.substring(0, 500) + (bodyContent.length > 500 ? "..." : ""),
        };
        emailMessages.push(emailMsg);
      } catch (parseErr: any) {
        console.error(`Error parsing message ${msg.uid}:`, parseErr.message);
      }
    }

    lock.release();
    await imap.logout();
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              messages: emailMessages,
              count: emailMessages.length,
              filters: {
                limit: args.limit,
                includeFullContent: args.includeFullContent,
                dateFrom: args.dateFrom,
                dateTo: args.dateTo,
                unreadOnly: args.unreadOnly,
                from: args.from,
                subject: args.subject,
              },
            },
            null,
            2
          ),
        },
      ],
    };
  } catch (err: any) {
    if (lock) {
      try {
        lock.release();
      } catch (releaseErr) {
        console.error("Error releasing lock:", releaseErr);
      }
    }
    if (imap) {
      try {
        await imap.logout();
      } catch (logoutErr) {
        console.error("Error logging out:", logoutErr);
      }
    }

    return {
      content: [
        {
          type: "text",
          text: `Error fetching messages: ${err.message}`,
        },
      ],
      isError: true,
    };
  }
}
