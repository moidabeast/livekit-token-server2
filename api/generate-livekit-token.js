import jwt from "jsonwebtoken";

export default function handler(req, res) {
  // --- Set CORS headers for ALL responses (including preflight) ---
  res.setHeader("Access-Control-Allow-Origin", "*"); // Or replace * with your specific origin for better security
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // --- Handle preflight OPTIONS request ---
  if (req.method === "OPTIONS") {
    return res.status(200).end(); // Now includes the CORS headers above
  }

  // --- Validate input (only for POST) ---
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { roomId, userId, role } = req.body || {};
  if (!roomId || !userId || !role) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  // --- LiveKit credentials (move to env vars!) ---
  const apiKey = "APIcZDwSz4aoyDN";
  const apiSecret = "9Ogsq1pmPX5ry8Gn18xe8hUCQjErV0JqfeKp6OR60YmA";

  // --- Correct JWT payload ---
  const payload = {
    iss: apiKey,
    sub: userId,
    exp: Math.floor(Date.now() / 1000) + 60 * 60,
    nbf: Math.floor(Date.now() / 1000),
    video: {
      roomJoin: true,
      room: roomId,
      canPublish: role === "broadcaster",
      canSubscribe: true,
    },
    metadata: JSON.stringify({ role }),
  };

  const token = jwt.sign(payload, apiSecret, { algorithm: "HS256" });
  res.status(200).json({ token });
}
