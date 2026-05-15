import {z} from "zod";

export const questionSchema = z.object({
    description: z.string().min(10),
    optionList: z.array(z.string()),
    questionType: z.enum(['single-choice', 'multiple-choice']),
    correctOption: z.string(),
    required: z.boolean()
})

export const pollSchema = z.object({
    authenticated: z.boolean(),
    expiryTime: z.string(),
    questionList: z.array(questionSchema),
})
