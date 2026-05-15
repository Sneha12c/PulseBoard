import {
  Request,
  Response,
  NextFunction,
} from "express";

import jwt from "jsonwebtoken";

export interface AuthRequest
  extends Request {
  user?: any;
}

export const verifyAccessToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const cookies = req.cookies;
    const authHeader = req.headers.authorization;
    if (!authHeader && !cookies) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
    
    const headertoken = authHeader ? authHeader.split(" ")[1] : "";
    const token = cookies?.accessToken ? cookies.accessToken : headertoken;

    const decoded = jwt.verify(
      token,
      process.env
        .ACCESS_TOKEN_SECRET as string
    );
    req.user = decoded;

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};