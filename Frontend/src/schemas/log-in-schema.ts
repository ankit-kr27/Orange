import { z } from 'zod';

export const logInSchema = z.object({
    email: z.string().email().optional(),
    username: z.string().min(3).max(20).optional(),
    password: z.string({message: "Password must be of atleast 6 characters"}).min(6),
}).refine((data)=>data.email || data.username, {
    message: 'Either email or username is required',
})

export type LogInSchema = z.infer<typeof logInSchema>;