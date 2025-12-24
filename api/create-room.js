import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  const apiKey = "APIcZDwSz4aoyDN";
  const apiSecret = "9Ogsq1pmPX5ry8Gn18xe8hUCQjErV0JqfeKp6OR60YmA";
  const { roomName } = req.body;

  try {
    // 1️⃣ Generate a REST API token
    const token = jwt.sign({}, apiSecret, {
      expiresIn: "1h",
      issuer: apiKey,
    });

    // 2️⃣ Use token to call LiveKit REST API
    const response = await fetch("https://sparr-4z7yxmt4.livekit.cloud/rooms", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: roomName,
        empty_timeout: 300,
      }),
    });

    const contentType = response.headers.get("content-type") || "";
    const data = contentType.includes("application/json") 
      ? await response.json() 
      : await response.text();

    res.status(response.status).json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
