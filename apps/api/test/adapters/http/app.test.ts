import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it, onTestFinished } from "vitest";
import { createApp } from "../../../src/adapters/http/app.ts";
import { listen } from "../../listen.ts";

async function start(webDir?: string) {
  const app = await listen(createApp({ routers: [], webDir }));
  onTestFinished(() => {
    app.server.close();
  });
  return app.url;
}

describe("createApp", () => {
  it("responds in JSON to a malformed body", async () => {
    const response = await fetch(`${await start()}/api/anything`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{oops",
    });
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: "Invalid request." });
  });

  it("serves the front end outside /api", async () => {
    const webDir = path.join(await mkdtemp(path.join(tmpdir(), "bttf-web-")), ".output");
    await mkdir(webDir);
    await writeFile(path.join(webDir, "index.html"), "<p>page Nuxt</p>");
    const url = await start(webDir);

    for (const page of ["/", "/cart"]) {
      const response = await fetch(`${url}${page}`);
      expect(response.status).toBe(200);
      expect(await response.text()).toBe("<p>page Nuxt</p>");
    }
    const unknownApi = await fetch(`${url}/api/unknown`);
    expect(unknownApi.status).toBe(404);
    expect(await unknownApi.json()).toEqual({ error: "Unknown route." });
  });
});
