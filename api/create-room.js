export default async function handler(req, res) {
  const apiKey = "APIcZDwSz4aoyDN";
  const apiSecret = "9Ogsq1pmPX5ry8Gn18xe8hUCQjErV0JqfeKp6OR60YmA";
  const { roomName } = req.body;

  const response = await fetch("https://sparr-4z7yxmt4.livekit.cloud/rooms", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${Buffer.from(`${apiKey}:${apiSecret}`).toString("base64")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: roomName,
      empty_timeout: 300,
    }),
  });

  const data = await response.json();
  
  console.log("LiveKit JSON response:", data); // <- log here
  res.status(response.status).json(data);        // <- return full JSON
}
