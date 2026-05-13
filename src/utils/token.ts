import jwt from "jsonwebtoken";

export const generateAccessToken = (
  id: string,
  email: string
) => {
  return jwt.sign(
    { id, email },
    process.env.ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: "15m",
    }
  );
};

export const generateRefreshToken = (
  id: string,
  email: string
) => {
  return jwt.sign(
    { id, email },
    process.env.REFRESH_TOKEN_SECRET as string,
    {
      expiresIn: "7d",
    }
  );
};