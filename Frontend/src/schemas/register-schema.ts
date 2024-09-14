import { z } from "zod";

export const registerSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z
        .string({ message: "Password is required" })
        .min(6, { message: "Password must be at least 6 characters long" }),
    avatar: z
        .instanceof(File)
        .nullable(),
    fullName: z
        .string({ message: "Full Name is required" })
        .min(1, { message: "Full Name cannot be empty" }),
    username: z
        .string()
        .min(3, { message: "Username must be at least 3 characters long" })
        .max(20, { message: "Username must be at most 20 characters long" }),
    coverImage: z
        .instanceof(File)
        .nullable()
        .optional(),
});

export type RegisterSchema = z.infer<typeof registerSchema>;
