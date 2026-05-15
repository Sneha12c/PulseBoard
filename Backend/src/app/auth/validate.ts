import { z } from "zod";

export const registerSchema = z.object({
    username: z.string().min(4).max(100),
    email: z.email(),
    password: z.string().min(6).max(66),
});

export const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(6).max(66),
});

