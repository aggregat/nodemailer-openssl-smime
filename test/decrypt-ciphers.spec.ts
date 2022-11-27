import { readFile } from "fs/promises";
import { join, resolve } from "path";
import { GenericContainer } from "testcontainers";

import { decrypt } from "..";

const ROOT_DIR = resolve(__dirname, "..");
const FIXTURE_DIR = resolve(ROOT_DIR, "fixtures", "data");

describe("decrypt", () => {
  it("should be defined", () => {
    expect(decrypt).toBeDefined();
  });

  it("should decrypt a buffer message that was encrypted with vanilla openssl smime and well-known ciphers", async () => {
    const MESSAGE = await readFile(join(FIXTURE_DIR, "message.fixture.txt"));
    const RECIPIENT = await readFile(
      join(FIXTURE_DIR, "recipient.fixture.pem")
    );
    const CIPHERS = ["des3", "aes128", "aes192", "aes256"];

    const image = await GenericContainer.fromDockerfile(
      ROOT_DIR,
      "Dockerfile.openssl-test"
    ).build();

    const openssl = await image
      .withCopyContentToContainer([
        { content: RECIPIENT, target: "/mnt/recipient.pem" },
        { content: MESSAGE, target: "/mnt/message.txt" },
      ])
      .start();

    for (const cipher of CIPHERS) {
      const { output, exitCode } = await openssl.exec([
        "openssl",
        "smime",
        "-encrypt",
        `-${cipher}`,
        "-in",
        "/mnt/message.txt",
        "/mnt/recipient.pem",
      ]);

      const result = decrypt(Buffer.from(output), RECIPIENT);
      expect(result).toBeInstanceOf(Buffer);
      expect(result.length).toBeGreaterThan(0);

      expect(Buffer.from(result)).toEqual(MESSAGE);
      expect(exitCode).toBe(0);
    }

    await openssl.stop();
  });
});
