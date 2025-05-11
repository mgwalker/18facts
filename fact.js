import fs from "node:fs/promises";
// import { AtpAgent } from "@atproto/api";
import * as dotenv from "dotenv";
import shuffle from "./shuffle.js";

const main = async () => {
  await shuffle();
  const facts = JSON.parse(await fs.readFile("shuffled.json"));
  const fact = facts[Math.floor(Math.random() * facts.length)];

  dotenv.config();

  const text = `${fact.name}:\n\n${fact.fact}`;
  console.log(text);

  // const agent = new AtpAgent({ service: "https://bsky.social" });
  // await agent.login({
  //   identifier: process.env.BLUESKY_ID,
  //   password: process.env.BLUESKY_PWD,
  // });

  // await agent.post({ text });

  const body = new FormData();
  body.set("status", text);

  await fetch(`${process.env.MASTO_SERVER}/api/v1/statuses`, {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.MASTO_TOKEN}` },
    body,
  });
};

if (process.argv[1] === import.meta.filename) {
  main();
}
