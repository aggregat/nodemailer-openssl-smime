import type MailMessage from "nodemailer/lib/mailer/mail-message";
import { encrypt } from "./binding";
import { fromStringOrBuffer } from "./utils";

export type PluginOptions = {
  recipient: Buffer | string;
  cipher?: string;
};

export const plugin = <T>({ recipient, cipher }: PluginOptions) => {
  if (!recipient) throw new Error("Missing recipient from options");

  return async (
    mail: MailMessage<T>,
    callback: (err?: Error | null) => void
  ) => {
    let err: Error | null = null;

    try {
      const message = await mail.message.build();
      const encrypted = encrypt(message, fromStringOrBuffer(recipient), cipher);
      mail.message.setRaw(encrypted);
    } catch (e) {
      err = e as Error;
    }

    callback(err);
  };
};
