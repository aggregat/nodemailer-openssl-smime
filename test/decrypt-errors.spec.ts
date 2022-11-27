import { readFile } from "fs/promises";
import { join, resolve } from "path";
import { decrypt } from "../dist/binding";

const ROOT_DIR = resolve(__dirname, "..");
const FIXTURE_DIR = resolve(ROOT_DIR, "fixtures", "data");

describe("decrypt error scenarios", () => {
  it("should throw in case of a missing public key", async () => {
    const MESSAGE = await readFile(join(FIXTURE_DIR, "encrypted-message.fixture.txt"));
    const RECIPIENT = await readFile(
      join(FIXTURE_DIR, "private-key.fixture.key")
    );
    expect(() => decrypt(MESSAGE, RECIPIENT)).toThrow(/public key/i);
  });

  it("should throw in case of a missing private key", async () => {
    const MESSAGE = await readFile(join(FIXTURE_DIR, "encrypted-message.fixture.txt"));
    const RECIPIENT = await readFile(
      join(FIXTURE_DIR, "public-key.fixture.pem")
    );
    expect(() => decrypt(MESSAGE, RECIPIENT)).toThrow(/private key/i);
  });

  it("should throw in case of an empty message", async () => {
    const MESSAGE = Buffer.from("");
    const RECIPIENT = await readFile(
      join(FIXTURE_DIR, "recipient.fixture.pem")
    );
    expect(() => decrypt(MESSAGE, RECIPIENT)).toThrow(/message/i);
  });

  it("should throw in case of a failure in decrypting the message", async () => {
    const MESSAGE = await readFile(
      join(FIXTURE_DIR, "encrypted-message.fixture.txt")
    );
    const RECIPIENT = await readFile(
      join(FIXTURE_DIR, "impostor.fixture.pem")
    );
    expect(() => decrypt(MESSAGE, RECIPIENT)).toThrow(/message/i);
  });
});
