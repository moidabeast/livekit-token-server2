export default async function handler(req, res) {
  const apiKey = "APIcZDwSz4aoyDN";
  const apiSecret = "9Ogsq1pmPX5ry8Gn18xe8hUCQjErV0JqfeKp6OR60YmA";
  const { roomName } = req.body;

  try {
    const response = await fetch("https://sparr-4z7yxmt4.livekit.cloud/rooms", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}:${apiSecret}`, // must be Bearer, not Basic
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: roomName,
        empty_timeout: 300,
      }),
    });

    const contentType = response.headers.get("content-type") || "";
    let data;

    if (contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text(); // fallback to plain text
    }

    res.status(response.status).json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
