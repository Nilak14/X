import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });
  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000, //millisecond
    httpOnly: true, //prevent xss attack cross-site scripting attacks -> cookie can be accessible from frontend
    sameSite: "strict", // CSFR attack cross-site request forgery attacks
    secure: process.env.NODE_ENV !== "development",
  });
};
