import { z } from "zod";

export const emailSchema = z.string().trim()
    .email("Invalid email address")
    .min(1, "Email is required")
    .max(255, "Email must be less than 255 characters");

export const passwordSchema = z.string().trim()
    .min(4, "Password must be at least 4 characters long");

export const registerSchema = z.object({
    name: z.string().trim().min(1).max(255),
    email: emailSchema,
    password: passwordSchema,
});

export const loginSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
});



