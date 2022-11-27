import { readFile } from "fs/promises";
import { join, resolve } from "path";
import { GenericContainer } from "testcontainers";

import { decrypt, DEFAULT_CIPHER } from "..";

const ROOT_DIR = resolve(__dirname, "..");
const FIXTURE_DIR = resolve(ROOT_DIR, "fixtures", "data");

describe("decrypt", () => {
  it("should be defined", () => {
    expect(decrypt).toBeDefined();
  });

  it("should decrypt a buffer message that was encrypted with vanilla openssl smime", async () => {
    const MESSAGE = await readFile(join(FIXTURE_DIR, "message.fixture.txt"));
    const RECIPIENT = await readFile(
      join(FIXTURE_DIR, "recipient.fixture.pem")
    );
    const CIPHER = DEFAULT_CIPHER;

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

    const { output, exitCode } = await openssl.exec([
      "openssl",
      "smime",
      "-encrypt",
      `-${CIPHER}`,
      "-in",
      "/mnt/message.txt",
      "/mnt/recipient.pem",
    ]);

    await openssl.stop();

    const result = decrypt(Buffer.from(output), RECIPIENT);
    expect(result).toBeInstanceOf(Buffer);
    expect(result.length).toBeGreaterThan(0);

    expect(Buffer.from(result)).toEqual(MESSAGE);
    expect(exitCode).toBe(0);
  });

  it("should decrypt a string message that was encrypted with vanilla openssl smime", async () => {
    const MESSAGE = await readFile(
      join(FIXTURE_DIR, "message.fixture.txt"),
      "utf8"
    );
    const RECIPIENT = await readFile(
      join(FIXTURE_DIR, "recipient.fixture.pem"),
      "utf8"
    );
    const CIPHER = DEFAULT_CIPHER;

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

    const { output, exitCode } = await openssl.exec([
      "openssl",
      "smime",
      "-encrypt",
      `-${CIPHER}`,
      "-in",
      "/mnt/message.txt",
      "/mnt/recipient.pem",
    ]);

    await openssl.stop();

    const result = decrypt(output, RECIPIENT);
    expect(typeof result).toEqual("string");
    expect(result.length).toBeGreaterThan(0);

    expect(result).toEqual(MESSAGE);
    expect(exitCode).toBe(0);
  });
});
