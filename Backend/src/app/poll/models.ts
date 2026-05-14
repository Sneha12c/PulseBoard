import mongoose, { Document, Schema, Types} from "mongoose";

export interface Iquestion{
    description: string,
    questionType: string,
    optionList: string[],
    correctOption: string,
    required: boolean
}

export interface IPoll extends Document {
    userId: Types.ObjectId,
    polllink: string,
    authenticated: boolean,
    questionList: Iquestion[],
    expiryTime: Date,
    isPublished: boolean
}


const questionSchema  = new Schema<Iquestion>({
    description: {
      type: String,
      required: true,
      trim: true,
    },
    questionType: {
      type: String,
      enum: ["single-choice", "multiple-choice"],
      default: "single-choice",
    },
    optionList: [
      {
        type: String,
        required: true,
      },
    ],
    correctOption: {
      type: String,
    },
    required: {
      type: Boolean,
      default: true,
    },
})

const pollSchema = new Schema<IPoll>({
    userId : {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    polllink: {
       type: String,
       required: true,
       unique: true,
       trim: true,
    },
    authenticated: {
       type: Boolean,
       required: true,
       default: true
    },
    questionList: {
      type: [questionSchema],
      required: true,
      validate: {
        validator: function (questions: Iquestion[]) {
          return questions.length > 0;
        }, message: "At least one question is required",
      },
    },
    expiryTime: {
      type: Date,
      required: true,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
}, { timestamps: true})

export const poll = mongoose.model("Poll", pollSchema);

