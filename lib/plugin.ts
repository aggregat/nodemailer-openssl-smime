import type Mail from "nodemailer/lib/mailer";
import type MailMessage from "nodemailer/lib/mailer/mail-message";

import { encrypt } from "./binding";
import { fromStringOrBuffer } from "./utils";

export type PluginOptions = {
  recipient: Buffer | string;
  cipher?: string;
};

const HEADERS: Readonly<Array<keyof Mail.Options>> = Object.freeze([
  "from",
  "to",
  "cc",
  "bcc",
  "replyTo",
  "inReplyTo",
  "subject",
  "sender",
  "date",
  "messageId",
]);

/**
 * Creates an object composed of the picked input properties.
 */
const pick = <T>(input: T, props: Readonly<Array<keyof T>>) =>
  Object.fromEntries(props.map((p) => [p, input[p]]));

export const plugin = <T>({ recipient, cipher }: PluginOptions) => {
  if (!recipient) throw new Error("Missing recipient from options");

  return async (
    mail: MailMessage<T>,
    callback: (err?: Error | null) => void
  ) => {
    let err: Error | null = null;

    try {
      const message = await mail.message.build();

      const headers = Object.fromEntries(
        Object.entries({
          ...pick(mail.data, HEADERS),
          ...mail.data.headers,
        })
          // Filter invalid values
          .filter(([, value]) => value ?? false)
          .map(([key, value]) => [
            // Take care of capital kebab case
            key
              .replace(/[a-z]/, (match) => match.toUpperCase())
              .replace(/([a-z])([A-Z])/g, (match, a, b) => `${a}-${b}`),
            // Concat arrays to comma-separated strings
            Array.prototype.concat.call([], value).join(", "),
          ])
          // Remove empty strings
          .filter(([, value]) => value.length > 0)
      );

      const encrypted = encrypt(
        message,
        fromStringOrBuffer(recipient),
        cipher,
        headers
      );

      mail.message.setRaw(encrypted);
    } catch (e) {
      err = e as Error;
    }

    callback(err);
  };
};
