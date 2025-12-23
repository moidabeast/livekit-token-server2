import jwt from "jsonwebtoken";

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { roomId, userId, role } = req.body || {};
  if (!roomId || !userId || !role) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  const apiKey = "APIcZDwSz4aoyDN";
  const apiSecret = "9Ogsq1pmPX5ry8Gn18xe8hUCQjErV0JqfeKp6OR60YmA";

  const payload = {
    iss: apiKey,
    sub: apiKey,
    aud: "livekit",
    room: roomId,
    participant_identity: userId,
    metadata: { role },
    exp: Math.floor(Date.now() / 1000) + 60 * 60 // 1 hour expiry
  };

  const token = jwt.sign(payload, apiSecret, { algorithm: "HS256" });
  res.status(200).json({ token });
}
