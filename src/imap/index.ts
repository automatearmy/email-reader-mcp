import { ImapFlow } from "imapflow";
interface IClient {
  user: string;
  pass: string;
}
const client = ({ user, pass }: IClient) =>
  new ImapFlow({
    host: "imap.gmail.com",
    port: 993,
    secure: true,
    logger: false,
    auth: {
      user,
      pass,
    },
  });

export { client as imapClient };
