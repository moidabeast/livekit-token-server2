import jwt from "jsonwebtoken";

export default function handler(req, res) {
  // --- CORS headers ---
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  // --- Validate input ---
  const { roomId, userId, role } = req.body || {};
  if (!roomId || !userId || !role) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  // --- LiveKit credentials ---
  const apiKey = "APIcZDwSz4aoyDN";
  const apiSecret = "9Ogsq1pmPX5ry8Gn18xe8hUCQjErV0JqfeKp6OR60YmA";

  // --- Correct LiveKit Cloud JWT payload ---
  const payload = {
    iss: apiKey,
    sub: apiKey,
    aud: "livekit", // required for LiveKit Cloud
    exp: Math.floor(Date.now() / 1000) + 60 * 60,
    grants: {
      roomJoin: true,
      roomCreate: role === "broadcaster",
      room: roomId,
      video: {
        roomJoin: true,
        room: roomId,
        canPublish: role === "broadcaster",
        canSubscribe: true,
        canPublishData: true
      },
      canPublishData: true,
      metadata: JSON.stringify({ role }),
      participant_identity: userId
    }
  };

  // --- Sign and return token ---
  const token = jwt.sign(payload, apiSecret, { algorithm: "HS256" });
  res.status(200).json({ token });
}
