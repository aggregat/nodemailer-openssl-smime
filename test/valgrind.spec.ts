import { resolve } from "path";
import { GenericContainer } from "testcontainers";

const ROOT_DIR = resolve(__dirname, "..");

describe("Valgrind", () => {
  it("should not leak memory", async () => {
    const container = await GenericContainer.fromDockerfile(
      ROOT_DIR,
      "Dockerfile.valgrind-test"
    ).build();

    const startedContainer = await container.start();
    const { exitCode } = await startedContainer.exec([
      "valgrind",
      "--trace-children=yes",
      "--leak-check=full",
      "--suppressions=valgrind.supp",
      "--log-file=valgrind.log",
      "--error-exitcode=1",
      "node",
      "./index.js",
    ]);

    /*
    const { output } = await startedContainer.exec(["cat", "valgrind.log"]);
    console.log(output);
    */

    expect(exitCode).toBe(0);
    await startedContainer.stop();
  }, 240_000);
});
