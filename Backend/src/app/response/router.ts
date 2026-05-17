import express from "express";
import type { Router } from "express";
import ResponseController from "./controller";
import { verifyAccessToken } from "../middleware/auth.middleware";

const responseRouter:Router = express.Router();
const responseHandler = new ResponseController();

responseRouter.post("/submit/:pollLink", responseHandler.handleSubmitResponse.bind(responseHandler));
responseRouter.get("/fetch/:pollId", responseHandler.handlefetchResponse.bind(responseHandler));

export default responseRouter;
