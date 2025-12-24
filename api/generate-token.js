import jwt from "jsonwebtoken";

export default function handler(req, res) {
  const { roomId, userId, role } = req.body;
  const apiKey = "APIcZDwSz4aoyDN";
  const apiSecret = "9Ogsq1pmPX5ry8Gn18xe8hUCQjErV0JqfeKp6OR60YmA";
  const payload = {
    sub: userId,
    name: userId,
    video: { roomJoin: true, room: roomId, canPublish: role === "broadcaster" },
  };
  const token = jwt.sign({ grants: payload }, apiSecret, {
    expiresIn: "1h",
    issuer: apiKey,
  });
  res.status(200).json({ token });
}
