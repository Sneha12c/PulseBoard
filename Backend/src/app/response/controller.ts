import { Response } from "express";
import { poll } from "../poll/models";
import { responseModel } from "./model";
import { AuthRequest } from "../middleware/auth.middleware";
import { getSocketservice } from "../socket/socketInstance";

class ResponseController {
  // SUBMIT RESPONSE
  public async handleSubmitResponse(
    req: AuthRequest,
    res: Response
  ) {
    try {
      const { pollLink } = req.params;
      const { answers } = req.body;
      console.log(pollLink);
      if(typeof pollLink != "string"){
        return res.status(400).json({ message: "Invalid link"})
      }
      const pollResult = await poll.findOne({ polllink: pollLink});

      if (!pollResult) {
        return res.status(404).json({
          message:
            "Poll not found",
        });
      }

      // expiry check
      if ( new Date() > new Date(pollResult.expiryTime)) {
        return res.status(400).json({
          message:
            "Poll expired",
        });
      }

      // authenticated poll check
      if (pollResult.authenticated && !req.user ) {
        return res.status(401).json({
          message: "Authentication required",
        });
      }

      // duplicate response prevention
      if (req.user) {
        const existingResponse = await responseModel.findOne({
            pollId: pollResult._id,
            userId: req.user.id,
          });

        if ( existingResponse ) {
          return res.status(400).json({
            message: "Already submitted",
          });
        }
      }

      // save response
      const response = await responseModel.create({
          pollId: pollResult._id,
          userId: req.user?.id,
          answerList: answers,
          submitTime: new Date()
        });
      
      const totalResponses = await responseModel.countDocuments({pollId: pollResult._id});
      const analyticsResult = await responseModel.aggregate([
              { $match: { pollId: pollResult._id }},
              { $unwind: "$answerList" },
              { $group: { _id : { questionId: "$answerList.questionId", option: "$answerList.selectedOption"}, count: { $sum: 1,}}}
      ]);
      const socketService = getSocketservice();
      socketService.emitPollAnalytics(pollLink, {totalResponses, analyticsResult});
      // SOCKET EVENT HERE
      // io.to(poll._id.toString()).emit(...)

      return res.status(201).json({
        success: true,
        message: "Response submitted",
        response,
      });
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        success: false,
      });
    }
  }

  // GET RAW RESPONSES
  public async handlefetchResponse(
    req: AuthRequest,
    res: Response
  ) {
    try {
      const { pollId } = req.params;

      const responses = await responseModel.findById(pollId)
          .populate(
            "userId",
            "username email"
          )
          .sort({
            createdAt: -1,
          });

      return res.status(200).json({
        success: true,
        responses,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
      });
    }
  }
}

export default ResponseController;
