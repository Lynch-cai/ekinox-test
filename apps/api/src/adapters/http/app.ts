import express, { type ErrorRequestHandler, type Router } from "express";

const sendJsonError: ErrorRequestHandler = (error, _req, res, _next) => {
  const status = error.status >= 400 && error.status < 500 ? error.status : 500;
  if (status === 500) console.error(error);
  res
    .status(status)
    .json({ error: status === 500 ? "Internal server error." : "Invalid request." });
};

export function createApp({ routers, webDir }: { routers: Router[]; webDir?: string }) {
  const app = express();
  app.use(express.json());

  for (const router of routers) app.use("/api", router);

  app.use("/api", (_req, res) => {
    res.status(404).json({ error: "Unknown route." });
  });

  if (webDir) {
    app.use(express.static(webDir, { redirect: false }));
    app.get("/{*path}", (_req, res) => {
      res.sendFile("index.html", { root: webDir });
    });
  }

  app.use(sendJsonError);
  return app;
}
