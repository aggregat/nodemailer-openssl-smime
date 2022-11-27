import { readFile } from "fs/promises";
import { join, resolve } from "path";
import { GenericContainer } from "testcontainers";

import { encrypt } from "../dist/binding";

const ROOT_DIR = resolve(__dirname, "..");
const FIXTURE_DIR = resolve(ROOT_DIR, "fixtures", "data");

describe("encrypt", () => {
  it("should be defined", () => {
    expect(encrypt).toBeDefined();
  });

  it("should encrypt a buffer message that can be decrypted with vanilla openssl smime", async () => {
    const MESSAGE = await readFile(join(FIXTURE_DIR, "message.fixture.txt"));
    const RECIPIENT = await readFile(
      join(FIXTURE_DIR, "recipient.fixture.pem")
    );
    const CIPHERS = ["des3", "aes128", "aes192", "aes256"];

    for (const cipher of CIPHERS) {
      const result = encrypt(MESSAGE, RECIPIENT, cipher);
      expect(result).toBeInstanceOf(Buffer);
      expect(result.length).toBeGreaterThan(0);

      const image = await GenericContainer.fromDockerfile(
        ROOT_DIR,
        "Dockerfile.openssl-test"
      ).build();

      const openssl = await image
        .withCopyContentToContainer([
          { content: RECIPIENT, target: "/mnt/recipient.pem" },
          { content: result, target: "/mnt/message.txt" },
        ])
        .start();

      const { output, exitCode } = await openssl.exec([
        "openssl",
        "smime",
        "-decrypt",
        `-${cipher}`,
        "-recip",
        "/mnt/recipient.pem",
        "-inkey",
        "/mnt/recipient.pem",
        "-in",
        "/mnt/message.txt",
      ]);

      await openssl.stop();

      expect(Buffer.from(output)).toEqual(MESSAGE);
      expect(exitCode).toBe(0);
    }
  });
});
