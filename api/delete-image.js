// api/delete-image.js
// DELETE /api/delete-image
// Body JSON: { url: "https://...blob.vercel-storage.com/..." }

const { del } = require("@vercel/blob");

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "DELETE" && req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return res.status(500).json({ error: "BLOB_READ_WRITE_TOKEN eksik" });
  }

  try {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const { url } = JSON.parse(Buffer.concat(chunks).toString("utf8"));

    if (!url || !url.includes("blob.vercel-storage.com")) {
      return res.status(400).json({ error: "Gecersiz Blob URL" });
    }

    await del(url, { token: process.env.BLOB_READ_WRITE_TOKEN });
    return res.status(200).json({ success: true });

  } catch (err) {
    console.error("[delete-image]", err);
    return res.status(500).json({ error: err.message || "Silme basarisiz" });
  }
};
