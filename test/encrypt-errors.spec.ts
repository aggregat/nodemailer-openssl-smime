import { readFile } from "fs/promises";
import { join, resolve } from "path";
import { encrypt } from "../dist/binding";

const ROOT_DIR = resolve(__dirname, "..");
const FIXTURE_DIR = resolve(ROOT_DIR, "fixtures", "data");

describe("encrypt error scenarios", () => {
  it("should throw in case of an invalid public key", async () => {
    const MESSAGE = await readFile(join(FIXTURE_DIR, "message.fixture.txt"));
    const RECIPIENT = await readFile(
      join(FIXTURE_DIR, "private-key.fixture.key")
    );
    expect(() => encrypt(MESSAGE, RECIPIENT)).toThrow(/public key/i);
  });

  it("should throw in case of an invalid cipher", async () => {
    const MESSAGE = await readFile(join(FIXTURE_DIR, "message.fixture.txt"));
    const RECIPIENT = await readFile(
      join(FIXTURE_DIR, "recipient.fixture.pem")
    );
    expect(() => encrypt(MESSAGE, RECIPIENT, "invalid-cipher")).toThrow(
      /cipher/i
    );
  });
});
