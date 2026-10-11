import { z } from "zod";
// authالتحقق من بيانات الـ
export const authSchema = z.object({
    // تحقق من بيانات الاسم
    name: z
    .string({message:'name type should be a string'})
    .min(3 , {message:'name length should be at least 3 characters'}).optional(),
    // تحقق من بيانات الايميل
    email: z
        .string({ message: "email type should be a string" })
        .email({ message: "invalid email address" }),
    // تحقق من بيانات الباسوورد
    password: z
        .string({ message: "password type should be a string" })
        .min(8, { message: "password length should be at least 8 characters" })
})

export const commentSchema = z.object({
    content:z
    .string({message:'content type should be a string'})
    .min(5 , {message:'content length should be at least 5 characters'}),
    parentCommentId: z
        .number()
        .int()
        .positive()
        .nullable()
        .optional(),
})