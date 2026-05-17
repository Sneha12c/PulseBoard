import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { pollSchema } from "./validate";
import { poll } from "./models";
import crypto from "crypto";
import { responseModel } from "../response/model";
import mongoose from "mongoose";

class PollHandler{
   public async createPoll(req: AuthRequest, res: Response){
    try{
        const pollvalidationResult = await pollSchema.safeParseAsync(req.body);
        if(!pollvalidationResult.success){
        return res.status(400).json({ message: "Body validation failed", error: pollvalidationResult.error.issues});
        }
        
        const { authenticated, expiryTime, questionList} = pollvalidationResult.data;
        
        const expiryDate = new Date(expiryTime);
        const currentDate = new Date();
        if(expiryDate <= currentDate){
        return res.status(400).json({
            message:
                "Expiry time must be future date",
            });
        }
        
        const polllinkId = crypto.randomBytes(8).toString("hex")
        const polllink = `${process.env.BASEURL}/poll/${polllinkId}`

        const pollResult = await poll.create({
            userId: req.user.id,
            polllink,
            authenticated,
            expiryTime: expiryDate,
            questionList
        })

        return res.status(201).json({ message: "Poll created successfully", link: polllink});
     }catch(err){
        return res.status(500).json({ message: "Internal Server Error"});
     }
   }

   public async fetchPoll(req: Request, res: Response){
    const { pollLink } = req.params;
    const pollResult = await poll.findOne({pollLink})
    if(!pollResult){
      return res.status(404).json({ message: "Invalid Poll link"});
    }
    if(new Date() > new Date(pollResult.expiryTime)){
      return res.status(400).json({message : "Poll link is expired"});
    }
    return res.status(200).json({ message : "poll fetched", pollResult.questionList});
   }
   
   public async handlePublish(req: AuthRequest, res: Response){
      const { pollId } = req.params;
      const pollResult = await poll.findById(pollId);

      if (!pollResult) {
        return res.status(404).json({message: "Poll not found"});
      }

      if(req.user.id != pollResult.userId.toString()){
       return res.status(403).json({message: "Forbidden"})
      }
      pollResult.isPublished = true;
      await pollResult.save();
      
      return res.status(200).json({
        message:
          "Poll results published",
      });
   }

    public async handleAnalytics(req: AuthRequest, res: Response){
      const { pollId } = req.params;
      if (!pollId) {
        return res.status(400).json({
            message: "Poll ID required",
        }); 
      }
      const pollResult = await poll.findById(pollId);

      if (!pollResult) {
        return res.status(404).json({
          message: "Poll not found",
        });
      }
      
      const totalResponses = await responseModel.countDocuments({pollId: pollResult._id});
      const analyticsResult = await responseModel.aggregate([
        { $match: { pollId: pollId }},
        { $unwind: "$answerList" },
        { $group: { _id : { questionId: "$answerList.questionId", option: "$answerList.selectedOption"}, count: { $sum: 1,}}}
      ]);

      return res.status(200).json({message: "Success", totalResponses, analyticsResult});
    }

}

export default PollHandler;
