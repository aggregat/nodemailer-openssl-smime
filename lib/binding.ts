import { join, resolve } from "path";
import { fromStringOrBuffer, toStringOrBuffer } from "./utils";

const addon = require("node-gyp-build")(resolve(join(__dirname, "..")));

export const DEFAULT_CIPHER = "des3";

export const encrypt = <TInput extends string | Buffer>(
  message: TInput,
  publicKey: TInput,
  cipher = DEFAULT_CIPHER,
  headers?: { [key: string]: string }
): string | Buffer =>
  toStringOrBuffer(
    message,
    addon.encrypt(
      fromStringOrBuffer(message),
      fromStringOrBuffer(publicKey),
      cipher,
      headers
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
