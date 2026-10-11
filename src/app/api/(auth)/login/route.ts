import { generateJwt } from "@/utils/generateToken";
import { prisma } from "@/utils/prisma";
import { authSchema } from "@/utils/validations";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request:NextRequest) {
    try {
        // جلب البيانات اللازمة
        const { email , password} = await request.json()
        // التحقق من البيانات
        const result = authSchema.safeParse({
                        email,
                        password
                    });
                    // اذا كانت البيانات غير صحيحة يرجع خطأ
                    if (!result.success) {
                        return NextResponse.json(
                            { message: result.error.issues },
                            { status: 422 }
                        );
                    }
                    // التحقق من وجود المستخدم في قاعدة البيانات من خلال الايميل
        const exitingUser = await prisma.user.findUnique({
                where: {email}
            })
            // اذا المستخدم غير موجود يعيد رسالة خطأ
            if (!exitingUser) {
                return NextResponse.json(
                    {message:'user not regestared'},
                    {status:401}
                )
            }
            // مقارنة كلمة السر المدخلة مع كلمة السر المشفرة الموجودة في قاعدة البيانات
            const comparePassword = await bcrypt.compare(password , exitingUser.password)
            // اذا كلمة السر غير صحيحة يعيد خطأ
            if (!comparePassword) {
                return NextResponse.json(
                    {message:'invalid password'},
                    {status:401}
                )
            }
            // البيانات التي سيتم تخزينها ضمن التوكن
            const jwtPayload = {
                userId: exitingUser.id,
                email: exitingUser.email,
                role: exitingUser.role
            }
            // انشاء التوكن
            const token = generateJwt(jwtPayload)

            // حفظ المعلومات ضمن الكوكيز
        const cookieStore = await cookies();

        cookieStore.set('jwtToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'strict',
            path: '/',
            maxAge: 60 * 60 * 24 * 30,
            }); 

            // المعلومات التي سيعيدها للمستخدم
            const userUpdate ={
                id:exitingUser.id,
                name:exitingUser.name,
                email:exitingUser.email,
            }

            // ارجاع معلومات المستخدم مع رسالة النجاح 
            return NextResponse.json(
                {message:"authenticated",user:userUpdate , token},
                {status:200}
            )
    } catch (error) {
        // إرجاع رسالة خطأ عند حدوث خطأ داخلي في السيرفر
        return NextResponse.json(
                {
                    message:'internal server error',
                    error:(error as Error).message
                },
                {status:500}
            )
    }
}