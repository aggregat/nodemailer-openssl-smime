const { encrypt, decrypt } = require("nodemailer-openssl-smime");
const assert = require("assert");
const { readFileSync } = require("fs");
const { join } = require("path");

const MESSAGE = readFileSync(join(__dirname, "message.fixture.txt"));
const ENCRYPTED_MESSAGE = readFileSync(
  join(__dirname, "encrypted-message.fixture.txt")
);
const RECIPIENT = readFileSync(join(__dirname, "recipient.fixture.pem"));
const PRIVATE_KEY = readFileSync(join(__dirname, "private-key.fixture.key"));
const PUBLIC_KEY = readFileSync(join(__dirname, "public-key.fixture.pem"));
const IMPOSTOR = readFileSync(join(__dirname, "impostor.fixture.pem"));

assert(encrypt, "The expected function is undefined");
assert(decrypt, "The expected function is undefined");

function testEndToEnd() {
  const encryptionResult = encrypt(MESSAGE, RECIPIENT);
  const decryptionResult = decrypt(encryptionResult, RECIPIENT);

  assert.strictEqual(
    Buffer.compare(decryptionResult, MESSAGE),
    0,
    "Unexpected value returned"
  );
}

function testEncryptErrorScenarios() {
  assert.throws(() => encrypt(MESSAGE, PRIVATE_KEY));
  assert.throws(() => encrypt(MESSAGE, RECIPIENT, "invalid-cipher"));
}

function testDecryptErrorScenarios() {
  assert.throws(() => decrypt(ENCRYPTED_MESSAGE, PRIVATE_KEY));
  assert.throws(() => decrypt(ENCRYPTED_MESSAGE, PUBLIC_KEY));
  assert.throws(() => decrypt("", RECIPIENT));
  assert.throws(() => decrypt(ENCRYPTED_MESSAGE, IMPOSTOR));
}

assert.doesNotThrow(testEndToEnd, undefined, "testEndToEnd threw an expection");
assert.doesNotThrow(
  testEncryptErrorScenarios,
  undefined,
  "testEncryptErrorScenarios threw an exception"
);
assert.doesNotThrow(
  testDecryptErrorScenarios,
  undefined,
  "testDecryptErrorScenarios threw an exception"
);

console.log("Tests passed- everything looks OK!");
