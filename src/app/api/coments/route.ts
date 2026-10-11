import { authincatedAndAuthorize } from "@/app/midelware/authincatedAndAuthorize";
import { prisma } from "@/utils/prisma";
import { commentSchema } from "@/utils/validations";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request:NextRequest) {
    try {
        const { content } = await request.json();

    const userPayload = await authincatedAndAuthorize(request,["ADMIN" , "USER"])

    if (!userPayload) {
            return NextResponse.json({message:'Forbidden'} , {status:403})
        }
        const validition = commentSchema.safeParse({content})
        // اذا لم تطابق الشروط تعيد رسالة الخطأ
        if (!validition.success) {
            return NextResponse.json(
                { message: validition.error.issues[0].message },
                { status: 400 }
            );
        }

        const createdComment = await prisma.comment.create({
    data: {
        content,
        userId: userPayload.userId
    },
    include: {
        user: {
            select: {
                id: true,
                name: true,
                image: true
            }
        },
        _count: {
            select: {
                vote: true
            }
        }
    }
});

        return NextResponse.json(
            {message:'Created Comment' , createdComment},
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

export async function GET(request:NextRequest) {
    try {
        
        // يأخذ الرابط كامل ضمن الريكويست و يحلله الى اقسام و يلتقط ما بعد (؟)
        const {searchParams} = new URL(request.url)
        //search ما بعد (؟) يأخذ المفتاح الذي يحمل اسم 
        const search = searchParams.get('search') || ''

        const userPayload = await authincatedAndAuthorize(request);
        // الذهاب لقاعدة البيانات لعرض التعليقات
        const comments = await prisma.comment.findMany({
            //و تعرضه و تكون غير حساسة لحالة الاحرف urlالشرط تأخذ الموجود ضمن ال
            where:{
                content:{
                    contains: search,
                    mode:'insensitive'
                }
            },
            // يكون ترتيب تنازلي حسب انشاء التغريدة
            orderBy:{
                createdAt:'desc'
            },
            // من جدول المستخدمين تعرض اسم المستخدم
            include:{
                user:{
                    select:{
                        id:true,
                        name:true,
                        image:true
                    }
                },
                _count: {
                    select:{
                        vote:true
                    }
                },
                vote: {
                    where: {
                        userId: userPayload?.userId ?? -1,
                    },
                    select: {
                        id: true,
                    },
                },
            }
        })
        return NextResponse.json({data:comments} , {status:200})
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