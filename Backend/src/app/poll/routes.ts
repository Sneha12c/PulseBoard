import express from "express";
import type { Router } from "express";
import PollHandler from "./controller";
import { verifyAccessToken } from "../middleware/auth.middleware";

const pollRouter: Router = express.Router();
const pollHandler = new PollHandler();

pollRouter.post("/create", verifyAccessToken, pollHandler.createPoll.bind(pollHandler));
pollRouter.get("/allpolls", verifyAccessToken, pollHandler.fetchallPoll.bind(pollHandler));
pollRouter.get("/:pollLink", pollHandler.fetchPoll.bind(pollHandler));
pollRouter.post("/publish/:pollId", verifyAccessToken, pollHandler.handlePublish.bind(pollHandler));
pollRouter.get("/analytics/:pollLink", verifyAccessToken, pollHandler.handleAnalytics.bind(pollHandler));

export default pollRouter;
