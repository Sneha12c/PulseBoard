import {z} from "zod";

export const questionSchema = z.object({
    description: z.string().min(10),
    optionList: z.array(z.string()),
    questionType: z.enum(['singlechoice', 'multiple-choice']),
    correctOption: z.string(),
    required: z.boolean()
})

export const pollSchema = z.object({
    authenticated: z.boolean(),
    expiryTime: z.date(),
    questionList: z.array(questionSchema),
})
