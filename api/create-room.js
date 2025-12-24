import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { roomName } = req.body || {};
  if (!roomName) {
    return res.status(400).json({ error: "Missing roomName" });
  }

  const apiKey = "APIcZDwSz4aoyDN";
  const apiSecret = "9Ogsq1pmPX5ry8Gn18xe8hUCQjErV0JqfeKp6OR60YmA";

  // Create REST JWT
  const token = jwt.sign(
    {
      iss: apiKey,
      exp: Math.floor(Date.now() / 1000) + 60, // 1 minute is fine
      video: { roomCreate: true },
    },
    apiSecret,
    { algorithm: "HS256" }
  );

  const response = await fetch(
    "https://sparr-4z7yxmt4.livekit.cloud/rooms",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: roomName,
        empty_timeout: 300,
      }),
    }
  );

  const text = await response.text();

  // LiveKit sometimes returns non-JSON on errors
  try {
    res.status(response.status).json(JSON.parse(text));
  } catch {
    res.status(response.status).send(text);
  }
}
