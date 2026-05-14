import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./auth/router";
import pollRouter from "./poll/routes";

export function applicationHandler(){
    const app = express();
    //middleware
    app.use(express.json())
    app.use(cookieParser());

    // routes
    app.use("/auth", authRouter);
    app.use("/api/polls", pollRouter);

    return app;
}

