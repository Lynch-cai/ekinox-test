import { spawn } from "node:child_process";
import { once } from "node:events";
import { type AddressInfo, createServer } from "node:net";
import path from "node:path";
import { describe, expect, it, onTestFinished } from "vitest";

const entryPoint = path.join(import.meta.dirname, "..", "src", "server.ts");

describe("server.ts", () => {
  it("exits with an error if the port is already in use", async () => {
    const occupant = createServer().listen(0, "localhost");
    await once(occupant, "listening");
    const server = spawn(process.execPath, [entryPoint], {
      env: { ...process.env, PORT: String((occupant.address() as AddressInfo).port) },
    });
    onTestFinished(() => {
      server.kill();
      occupant.close();
    });

    const [exitCode] = await once(server, "exit");
    expect(exitCode).not.toBe(0);
  });
});
