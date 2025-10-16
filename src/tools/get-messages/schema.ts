import z from "zod/v3";

const getMessagesSchema = z.object({
  limit: z.number().optional().default(10).describe("Maximum number of messages to fetch"),
  includeFullContent: z
    .boolean()
    .optional()
    .default(false)
    .describe("Include full email body (default: preview only)"),
  dateFrom: z.string().optional().describe("Filter messages from this date (ISO string)"),
  dateTo: z.string().optional().describe("Filter messages until this date (ISO string)"),
  unreadOnly: z.boolean().optional().default(false).describe("Only fetch unread messages"),
  from: z.string().optional().describe("Filter by sender email address"),
  subject: z.string().optional().describe("Filter by subject (partial match)"),
});

type getMessagesType = z.infer<typeof getMessagesSchema>;

// Input type for the handler (allows partial objects with defaults)
type GetMessagesInput = Partial<
  Omit<getMessagesType, "limit" | "includeFullContent" | "unreadOnly">
> & {
  limit?: number;
  includeFullContent?: boolean;
  unreadOnly?: boolean;
};

export { getMessagesSchema, getMessagesType, GetMessagesInput };
