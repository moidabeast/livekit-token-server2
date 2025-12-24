import { AccessToken } from "livekit-server-sdk";

export default async function handler(req, res) {
  // --- CORS headers ---
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  // --- Validate input ---
  const { roomId, userId, role } = req.body || {};
  if (!roomId || !userId || !role) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  // --- LiveKit credentials (use env vars in production!) ---
  const apiKey = process.env.LIVEKIT_API_KEY || "APIcZDwSz4aoyDN";
  const apiSecret = process.env.LIVEKIT_API_SECRET || "9Ogsq1pmPX5ry8Gn18xe8hUCQjErV0JqfeKp6OR60YmA";

  // --- Create token ---
  const at = new AccessToken(apiKey, apiSecret, {
    identity: userId,              // participant's identity (sub claim)
    ttl: "1h",                     // token valid for 1 hour
    metadata: JSON.stringify({ role }),  // optional metadata
  });

  at.addGrant({
    roomJoin: true,
    room: roomId,
    canPublish: role === "broadcaster",
    canSubscribe: true,
  });

  const token = await at.toJwt();

  res.status(200).json({ token });
}
