import { z } from "zod";

export const usersSignUpPayload = z.object({
    username: z.string().min(6).max(233),
    email: z.email(),
    password: z.string().min(6).max(66),
    emailVerified: z.boolean(),
    salt: z.string()
})

