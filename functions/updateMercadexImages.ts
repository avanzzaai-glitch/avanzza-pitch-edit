// v3 - mercadex image updater
import base44 from "../base44_client.ts";

const TARGET_APP = "69bd0d9f679d1c284a79a67f";

const UPDATES = [
  { id: "69bd11fa679d1c284a79ac2a", image: "https://media.base44.com/images/public/69bcee79d908094d21d71ce3/28ad8c16b_generated_image.png", images: ["https://media.base44.com/images/public/69bcee79d908094d21d71ce3/28ad8c16b_generated_image.png","https://media.base44.com/images/public/69bcee79d908094d21d71ce3/04689e439_generated_image.png"] },
  { id: "69bd11fa679d1c284a79ac2b", image: "https://media.base44.com/images/public/69bcee79d908094d21d71ce3/00b9239bc_generated_image.png", images: ["https://media.base44.com/images/public/69bcee79d908094d21d71ce3/00b9239bc_generated_image.png","https://media.base44.com/images/public/69bcee79d908094d21d71ce3/c56b1d731_generated_image.png"] },
  { id: "69bd11fa679d1c284a79ac25", image: "https://media.base44.com/images/public/69bcee79d908094d21d71ce3/d23ea671a_generated_image.png", images: ["https://media.base44.com/images/public/69bcee79d908094d21d71ce3/d23ea671a_generated_image.png","https://media.base44.com/images/public/69bcee79d908094d21d71ce3/2b73fd522_generated_image.png"] },
  { id: "69bd11fa679d1c284a79ac27", image: "https://media.base44.com/images/public/69bcee79d908094d21d71ce3/1bf66159e_generated_image.png", images: ["https://media.base44.com/images/public/69bcee79d908094d21d71ce3/1bf66159e_generated_image.png","https://media.base44.com/images/public/69bcee79d908094d21d71ce3/4d57fd0e1_generated_image.png"] },
  { id: "69bd11fa679d1c284a79ac28", image: "https://media.base44.com/images/public/69bcee79d908094d21d71ce3/519fc6271_generated_image.png", images: ["https://media.base44.com/images/public/69bcee79d908094d21d71ce3/519fc6271_generated_image.png","https://media.base44.com/images/public/69bcee79d908094d21d71ce3/9a4fc7a34_generated_image.png"] },
  { id: "69bd11fa679d1c284a79ac2c", image: "https://media.base44.com/images/public/69bcee79d908094d21d71ce3/59ebd6975_generated_image.png", images: ["https://media.base44.com/images/public/69bcee79d908094d21d71ce3/59ebd6975_generated_image.png","https://media.base44.com/images/public/69bcee79d908094d21d71ce3/2b32403be_generated_image.png"] },
  { id: "69bd11fa679d1c284a79ac2d", image: "https://media.base44.com/images/public/69bcee79d908094d21d71ce3/64014eb48_generated_image.png", images: ["https://media.base44.com/images/public/69bcee79d908094d21d71ce3/64014eb48_generated_image.png","https://media.base44.com/images/public/69bcee79d908094d21d71ce3/9c90d14f4_generated_image.png"] },
  { id: "69bd11fa679d1c284a79ac30", image: "https://media.base44.com/images/public/69bcee79d908094d21d71ce3/c4b906873_generated_image.png", images: ["https://media.base44.com/images/public/69bcee79d908094d21d71ce3/c4b906873_generated_image.png","https://media.base44.com/images/public/69bcee79d908094d21d71ce3/7cb5ba863_generated_image.png"] },
  { id: "69bd11fa679d1c284a79ac2f", image: "https://media.base44.com/images/public/69bcee79d908094d21d71ce3/6ebd77c2e_generated_image.png", images: ["https://media.base44.com/images/public/69bcee79d908094d21d71ce3/6ebd77c2e_generated_image.png","https://media.base44.com/images/public/69bcee79d908094d21d71ce3/3b992a3dc_generated_image.png"] },
  { id: "69bd11fa679d1c284a79ac2e", image: "https://media.base44.com/images/public/69bcee79d908094d21d71ce3/88cfaadad_generated_image.png", images: ["https://media.base44.com/images/public/69bcee79d908094d21d71ce3/88cfaadad_generated_image.png","https://media.base44.com/images/public/69bcee79d908094d21d71ce3/c83671233_generated_image.png"] }
];

export default async function handler(req: Request) {
  const results = [];
  const db = base44.app(TARGET_APP).asServiceRole.entities.Product;
  for (const u of UPDATES) {
    try {
      await db.update(u.id, { image: u.image, images: u.images });
      results.push({ id: u.id, status: "ok" });
    } catch (e: any) {
      results.push({ id: u.id, status: "error", error: e.message });
    }
  }
  const ok = results.filter(r => r.status === "ok").length;
  return Response.json({ updated: ok, total: UPDATES.length, results });
}
