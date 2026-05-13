import express from "express";
import type { Router } from "express";
import AuthenticationHandler from "./controller";


const authRouter:Router = express.Router();
const authenticationHandler = new AuthenticationHandler();

authRouter.post("/signup", authenticationHandler.handleSignUp.bind(authenticationHandler));
authRouter.post("/signin", authenticationHandler.handleSignIn.bind(authenticationHandler));
authRouter.get("/verify/accesstoken", authenticationHandler.verifyAccessToken.bind(authenticationHandler));
authRouter.get("/create/accesstoken", authenticationHandler.createAccessToken.bind(authenticationHandler));
authRouter.get("/logout", authenticationHandler.handleLogout.bind(authenticationHandler));

export default authRouter;
