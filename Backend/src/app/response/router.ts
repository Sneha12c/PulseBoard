import express from "express";
import type { Router } from "express";
import ResponseController from "./controller";

const responseRouter:Router = express.Router();
const responseHandler = new ResponseController();

responseRouter.post("/submit/:polllink", responseHandler.handleSubmitResponse.bind(responseHandler));
responseRouter.get("/fetch/:pollId", responseHandler.handlefetchResponse.bind(responseHandler));

export default responseRouter;
