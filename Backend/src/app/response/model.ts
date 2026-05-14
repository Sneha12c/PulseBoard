import mongoose , {Document, Schema, Types} from "mongoose";

interface IAnswer {
  questionId: string;
  selectedOption: string;
}

export interface IResponse extends Document{
    userId: Types.ObjectId,
    pollId: Types.ObjectId,
    answerList: IAnswer[],
    submitTime: Date,
}

const answerSchema = new Schema<IAnswer>(
    {
      questionId: {
        type: String,
        required: true,
      },
      selectedOption: {
        type: String,
        required: true,
      },
    },
    { _id: false }
  );

const responseSchema = new Schema<IResponse>({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    pollId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "poll",
        required: true,
    },
    answerList: {
        type: [answerSchema],
        required: true,
        validate: {
          validator: function ( answerList: IAnswer[]){
            return ( answerList.length > 0);
          },
          message: "At least one answer is required",
        },
    },
    submitTime: {
      type: Date,
      required: true,
    },
});

export const responseModel = mongoose.model("response", responseSchema);
