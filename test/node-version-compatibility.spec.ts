import { resolve } from "path";
import { GenericContainer } from "testcontainers";

const ROOT_DIR = resolve(__dirname, "..");

const makeCompatibilityTestForVersion = (version: number) => async () => {
  const container = await GenericContainer.fromDockerfile(
    ROOT_DIR,
    "Dockerfile.node-version-compatibility-test"
  )
    .withBuildArgs({
      RUN_NODE_VERSION: `${version}`,
    })
    .build();

  const startedContainer = await container.start();

  const { output } = await startedContainer.exec(["node", "--version"]);
  expect(output).toMatch(new RegExp(`v${version}\\.[0-9]+\\.[0-9]+`));

  const { exitCode } = await startedContainer.exec(["npm", "start"]);
  expect(exitCode).toBe(0);
  await startedContainer.stop();
};

describe("Node.js version compatibility", () => {
  it(
    "should work with Node.js 18",
    makeCompatibilityTestForVersion(18),
    240_000
  );
  it(
    "should work with Node.js 16",
    makeCompatibilityTestForVersion(16),
    240_000
  );
  it(
    "should work with Node.js 14",
    makeCompatibilityTestForVersion(14),
    240_000
  );
});
