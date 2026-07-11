import { readFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import path from "node:path";

const DATABUDDY_ID = "6e266460-1002-499c-9908-64b513ac906e";

export default async function handler(req, res) {
  const md = await readFile(path.join(process.cwd(), "STYLE.md"), "utf8");

  try {
    await fetch(`https://basket.databuddy.cc/track?website_id=${DATABUDDY_ID}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: "style_download",
        anonymousId: randomUUID(),
        timestamp: Date.now(),
        properties: {
          user_agent: (req.headers["user-agent"] || "unknown").slice(0, 120),
        },
      }),
    });
  } catch {
    // never let analytics failures break the download
  }

  res.setHeader("Content-Type", "text/markdown; charset=utf-8");
  // no-store so every download reaches this function and gets counted
  res.setHeader("Cache-Control", "no-store");
  res.status(200).send(md);
}
