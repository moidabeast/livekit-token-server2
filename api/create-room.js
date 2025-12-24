export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = "APIcZDwSz4aoyDN";
  const apiSecret = "9Ogsq1pmPX5ry8Gn18xe8hUCQjErV0JqfeKp6OR60YmA";
  const { roomName } = req.body || {};

  if (!roomName) {
    return res.status(400).json({ error: "Missing roomName" });
  }

  const response = await fetch(
    "https://sparr-4z7yxmt4.livekit.cloud/twirp/livekit.RoomService/CreateRoom",
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${apiKey}:${apiSecret}`
        ).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: roomName,
        empty_timeout: 300,
      }),
    }
  );

  const text = await response.text();

  // Handle non-JSON errors safely
  try {
    const data = JSON.parse(text);
    res.status(response.status).json(data);
  } catch {
    res.status(response.status).send(text);
  }
}
