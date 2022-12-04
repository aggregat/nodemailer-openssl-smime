import { join, resolve } from "path";
import { fromStringOrBuffer, toStringOrBuffer } from "./utils";

const addon = require("node-gyp-build")(resolve(join(__dirname, "..")));

export const DEFAULT_CIPHER = "aes-256-cbc";

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
