import { generateJwt } from "@/utils/generateToken";
import { prisma } from "@/utils/prisma";
import { authSchema } from "@/utils/validations";
import fs from 'fs';
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

    export async function POST(request:NextRequest) {
        try {
            const formData = await request.formData();

            const name = formData.get("name")?.toString() || '';
            const email = formData.get("email")?.toString() || '';
            const password = formData.get("password")?.toString() || '';
            const image = formData.get("image") as File;
            // التحقق من بيانات الحقول
            const result = authSchema.safeParse({
                name,
                email,
                password
            });
            // اذا بيانات الحقول غير صحيحة يرجع خطأ
            if (!result.success) {
                return NextResponse.json(
                    { message: result.error.issues },
                    { status: 422 }
                );
            }
            
    
            
            // نتحقق من وجود المستخدم في قاعدة البيانات من خلال الايميل
            const exitingUser = await prisma.user.findUnique({
                where: {email}
            })
            // اذا كان المستخدم موجود نعيد له خطأ
            if (exitingUser) {
                return NextResponse.json(
                    {message:'user already regestared , please login'},
                    {status:409}
                )
            }
            // يذهب الى اساس المشروع ثم الى المسار الموجود و يدمج المسارين معا
        const uploadDir = path.join(process.cwd(),'/public/uploads')
        // من اجل انواع ملفات المسموح رفعها
        const allowedTypes = ['image/jpeg' , 'image/png' , 'image/webp']
        // (2MB) اكبر حجم للملف هو 
        const maxSize = 2 * 1024 * 1024
        // اذا لم يكن المجلد موجود ضمن المسار سوف ينشئه
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir,{recursive:true})
        }

           //( null إذا لم يتم رفع صورة تكون) قيمة مبدئية لاسم الملف 
        let fileName: string | null = null;
        // يفحص إذا تم إرسال صورة بالفعل قبل التأكد من نوعها وحجمها
        if (image && image.size > 0 && image.name) {
            // يفحص اذا الصورة التي تم رفعها ليست من ضمن الانواع المسموحة
            if (!allowedTypes.includes(image.type)) {
                return NextResponse.json(
                    // عرض رسالة ان النوع خاطئ و يعرض مصفوفة الانواع المسموحة و بينهم فاصلة
                    { message: `invalid file type. allowed types : ${allowedTypes.join(', ')}` },
                    { status: 400 }
                )
            }


        // اذا كانت الصورة المرفوعة اكبر من الحجم المسموح تعيد رسالة فيها نص و الحجم المسموح
        if (image.size > maxSize) {
            return NextResponse.json(
                {message:`max size exceeds the limit of ${maxSize / 1024 / 1024}MB`},
                {status:400}
            )
        }
    
        // اسم الصورة عند تخزينها يكون وقت رفع الصورة ثم (_) ثم اسم الصورة التي رفعت
        fileName = `${Date.now()}_${image.name}`
        // مسارها يكون مسار المجلدات و بعده اسم الصورة الكامل
        const filePath = path.join(uploadDir , fileName)
        // تحويل الملف المرفوع الى مصفوفة بايتات 0 و 1
        const buffer = Buffer.from(await image.arrayBuffer())
        // كتابة وحفظ ملف الصورة
        fs.writeFileSync(filePath,new Uint8Array(buffer))
    }
            // تشفير الباسوورد
            const hashedPassword = await bcrypt.hash(password,10)
            // انشاء المستخدم مع كلمة السر المشفرة
            const user = await prisma.user.create({
                data:{
                    name:name, 
                    email:email, 
                    password:hashedPassword, 
                    image:fileName ?`/uploads/${fileName}`:null
                }
            })
            // تخزين بيانات التوكن
            const jwtPayload = {
                userId: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
            // انشاء التوكن
            const token = generateJwt(jwtPayload)
            // التخزين ضمن الكوكيز
            const cookieStore = await cookies();
            
                cookieStore.set('jwtToken', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: 'strict',
                path: '/',
                maxAge: 60 * 60 * 24 * 30,
                });
                // بيانات المستخدم المرجعة
                const userRequest = {
                    id:user.id,
                    name:user.name,
                    email:user.email,
                    image:user.image
                }
                // ارجاع بيانات المستخدم مع رسالة النجاح
                return NextResponse.json(
                    {userRequest , message:'registered & authenticated'},
                    {status:201}
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