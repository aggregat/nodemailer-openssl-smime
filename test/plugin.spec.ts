import { readFile, writeFile } from "fs/promises";
import { createTransport } from "nodemailer";
import { join, resolve } from "path";
import { Stream } from "stream";

import { decrypt, plugin } from "..";

const ROOT_DIR = resolve(__dirname, "..");
const FIXTURE_DIR = resolve(ROOT_DIR, "fixtures", "data");

const streamToBuffer = (stream: Stream) =>
  new Promise<Buffer>((resolve) => {
    const buffers: Array<Uint8Array> = [];
    stream.on("data", (chunk: Uint8Array) => buffers.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(buffers)));
  });

describe("plugin", () => {
  it("should be defined", () => {
    expect(plugin).toBeDefined();
  });

  it("should throw in case of a missing recipient", () => {
    expect(() => plugin({} as any)).toThrow(/recipient/i);
  });

  it("should send S/MIME encrypted emails", async () => {
    const RECIPIENT = await readFile(
      join(FIXTURE_DIR, "recipient.fixture.pem")
    );
    const TEXT = "Hello world!";

    const transporter = createTransport({
      streamTransport: true,
    }).use("stream", plugin({ recipient: RECIPIENT }));

    const result = await transporter.sendMail({
      from: "sender@example.com",
      to: "recipient@example.com",
      subject: "This is a test",
      text: TEXT,
    });

    expect(result).toBeTruthy();
    const message = await streamToBuffer(result.message as Stream);

    expect(decrypt(message, RECIPIENT).toString()).toContain(TEXT);
  });
});
