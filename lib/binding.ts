import { join, resolve } from "path";

const addon = require("node-gyp-build")(resolve(join(__dirname, "..")));

export const DEFAULT_CIPHER = "aes-256-cbc";

const fromStringOrBuffer = <TInput extends string | Buffer>(input: TInput) =>
  Buffer.isBuffer(input) ? input : Buffer.from(input);

const toStringOrBuffer = <TInput extends string | Buffer>(
  input: TInput,
  output: Buffer
): string | Buffer => (Buffer.isBuffer(input) ? output : output.toString());

export const encrypt = <TInput extends string | Buffer>(
  message: TInput,
  publicKey: TInput,
  cipher = DEFAULT_CIPHER
): string | Buffer =>
  toStringOrBuffer(
    message,
    addon.encrypt(
      fromStringOrBuffer(message),
      fromStringOrBuffer(publicKey),
      cipher
    )
  );

export const decrypt = <TInput extends string | Buffer>(
  message: TInput,
  keyPair: TInput
): string | Buffer =>
  toStringOrBuffer(
    message,
    addon.decrypt(fromStringOrBuffer(message), fromStringOrBuffer(keyPair))
  );

export default {
  encrypt,
  decrypt,
};
