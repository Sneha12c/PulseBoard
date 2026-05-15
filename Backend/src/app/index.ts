import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./auth/router";
import pollRouter from "./poll/routes";
import responseRouter from "./response/router";
import cors from "cors";

export function applicationHandler(){
    const app = express();
    app.use(cors({
        origin: process.env.CORS_ORIGIN, 
        credentials: true,               
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"]
    }));
    //middleware
    app.use(express.json())
    app.use(cookieParser());

    // routes
    app.use("/auth", authRouter);
    app.use("/poll", pollRouter);
    app.use("/response", responseRouter);

    return app;
}

