import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import {
  loginSchema,
  registerSchema,
} from "./validate";

import { User } from "./models";

import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/token";

class AuthenticationHandler {
  // SIGNUP
  public async handleSignUp(
    req: Request,
    res: Response
  ) {
    try {
      const validationResult =
        await registerSchema.safeParseAsync(
          req.body
        );

      if (!validationResult.success) {
        return res.status(400).json({
          message: "Validation failed",
          error: validationResult.error.issues,
        });
      }

      const {
        username,
        email,
        password,
      } = validationResult.data;

      // existing user
      const existingUser =
        await User.findOne({ email });

      if (existingUser) {
        return res.status(409).json({
          message:
            "User already exists. Please SignIn",
        });
      }

      // create user
      const user = await User.create({
        username,
        email,
        password,
      });

      // tokens
      const accessToken =
        generateAccessToken(
          user._id.toString(),
          user.email
        );

      const refreshToken =
        generateRefreshToken(
          user._id.toString(),
          user.email
        );

      // save refresh token
      user.refreshToken = refreshToken;
      await user.save();

      // set cookie
      res.cookie(
        "refreshToken",
        refreshToken,
        {
          httpOnly: true,
          secure: false,
          sameSite: "strict",
          maxAge:
            7 * 24 * 60 * 60 * 1000,
        }
      );

      return res.status(201).json({
        success: true,
        message:
          "User registered successfully",

        accessToken,

        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      });
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
  }

  // SIGNIN
  public async handleSignIn(
    req: Request,
    res: Response
  ) {
    try {
      const validationResult =
        await loginSchema.safeParseAsync(
          req.body
        );

      if (!validationResult.success) {
        return res.status(400).json({
          message: "Validation failed",
          error: validationResult.error.issues,
        });
      }

      const { email, password } =
        validationResult.data;

      const userResult =
        await User.findOne({ email }).select(
          "+password +refreshToken"
        );

      if (!userResult) {
        return res.status(401).json({
          message: "Invalid Credentials",
        });
      }

      // IMPORTANT FIX
      const isPasswordCorrect =
        await bcrypt.compare(
          password,
          userResult.password
        );

      if (!isPasswordCorrect) {
        return res.status(401).json({
          message: "Invalid Credentials",
        });
      }

      // generate tokens
      const accessToken =
        generateAccessToken(
          userResult._id.toString(),
          userResult.email
        );

      const refreshToken =
        generateRefreshToken(
          userResult._id.toString(),
          userResult.email
        );

      // store refresh token
      userResult.refreshToken =
        refreshToken;

      await userResult.save();

      // cookie
      res.cookie(
        "refreshToken",
        refreshToken,
        {
          httpOnly: true,
          secure: false,
          sameSite: "strict",
          maxAge:
            7 * 24 * 60 * 60 * 1000,
        }
      );

      return res.status(200).json({
        success: true,
        message: "Login successful",

        accessToken,

        user: {
          id: userResult._id,
          username:
            userResult.username,
          email: userResult.email,
        },
      });
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
  }

  // VERIFY ACCESS TOKEN
  public async verifyAccessToken(
    req: Request,
    res: Response
  ) {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return res.status(401).json({
          message: "No token provided",
        });
      }

      const token = authHeader.split(" ")[1];
      
      if(!token){
        return res.status(401).json({
          message: "Invalid Token",
        });
      }

      const decoded = jwt.verify(
        token,
        process.env
          .ACCESS_TOKEN_SECRET as string
      );

      return res.status(200).json({
        success: true,
        decoded,
      });
    } catch (error) {
      return res.status(401).json({
        message: "Invalid token",
      });
    }
  }

  // CREATE NEW ACCESS TOKEN
  public async createAccessToken(
    req: Request,
    res: Response
  ) {
    try {
      const refreshToken =
        req.cookies.refreshToken;

      if (!refreshToken) {
        return res.status(401).json({
          message:
            "Refresh token missing",
        });
      }

      // verify refresh token
      const decoded: any = jwt.verify(
        refreshToken,
        process.env
          .REFRESH_TOKEN_SECRET as string
      );

      // find user
      const user = await User.findById(
        decoded.id
      ).select("+refreshToken");

      if (!user) {
        return res.status(401).json({
          message: "User not found",
        });
      }

      // compare refresh token
      if (
        user.refreshToken !==
        refreshToken
      ) {
        return res.status(401).json({
          message:
            "Invalid refresh token",
        });
      }

      // generate new access token
      const newAccessToken =
        generateAccessToken(
          user._id.toString(),
          user.email
        );

      return res.status(200).json({
        success: true,
        accessToken:
          newAccessToken,
      });
    } catch (error) {
      return res.status(401).json({
        message:
          "Refresh token expired",
      });
    }
  }

  // LOGOUT
  public async handleLogout(
    req: Request,
    res: Response
  ) {
    try {
      const refreshToken =
        req.cookies.refreshToken;

      if (refreshToken) {
        const user =
          await User.findOne({
            refreshToken,
          }).select("+refreshToken");

        if (user) {
          user.refreshToken = "";
          await user.save();
        }
      }

      res.clearCookie("refreshToken");

      return res.status(200).json({
        success: true,
        message:
          "Logged out successfully",
      });
    } catch (error) {
      return res.status(500).json({
        message: "Logout failed",
      });
    }
  }
}

export default AuthenticationHandler;