import {z} from 'zod';

export const changeUsernameSchema = z.object({
    username: z.string().min(2),
})

export const signupSchema = z.object({
    email: z.string().email(),
    username: z.string().min(2, 'Username can not be empty'),
    weekly_hours: z.coerce.number().min(1, { message: "Weekly work hours goal is too low" }),
    work_days: z.coerce.number().min(1, { message: "Number of work days is too low" })
                                   .max(7, { message: "Number of work days is too high" }),
    password: z.string().regex(/[a-z]/, {message: "Password must contain at least one lowercase letter"})
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, { message: "Password must contain at least one special character" })
    .min(8, 'Password must be at least 8 characters long'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});