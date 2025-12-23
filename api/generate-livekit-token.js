import jwt from "jsonwebtoken";

export default function handler(req, res) {
  const { roomId, userId, role } = req.body;
  const apiKey = "APIcZDwSz4aoyDN";
  const apiSecret = "9Ogsq1pmPX5ry8Gn18xe8hUCQjErV0JqfeKp6OR60YmA";

  const payload = {
    iss: apiKey,
    sub: apiKey,
    aud: "livekit",
    room: roomId,
    participant_identity: userId,
    metadata: { role },
    exp: Math.floor(Date.now() / 1000) + 60 * 60 // 1 hour
  };

  const token = jwt.sign(payload, apiSecret, { algorithm: "HS256" });
  res.status(200).json({ token });
}
