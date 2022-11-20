import { join, resolve } from "path";

const addon = require("node-gyp-build")(resolve(join(__dirname, "..")));

export const DEFAULT_CIPHER = "aes-256-cbc";

export const encrypt = (
  message: Buffer,
  certificate: Buffer,
  cipher = DEFAULT_CIPHER
): Buffer => addon.encrypt(message, certificate, cipher);

export const decrypt = (message: Buffer, keyPair: Buffer): Buffer =>
  addon.decrypt(message, keyPair);

export default {
  encrypt,
  decrypt,
};
