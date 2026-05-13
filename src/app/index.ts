import express from "express";
import authRouter from "./auth/router";

export function applicationHandler(){
    const app = express();
    //middleware
    app.use(express.json())

    // routes
    app.use("/auth", authRouter);

    return app;
}

