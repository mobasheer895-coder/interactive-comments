import { authincatedAndAuthorize } from "@/app/midelware/authincatedAndAuthorize";
import { prisma } from "@/utils/prisma";
import { commentSchema } from "@/utils/validations";
import { NextRequest, NextResponse } from "next/server";
interface props {
    params: Promise<{comentId:string}>
}
export async function POST(request: NextRequest, { params }: props) {
    try {
        const { content } = await request.json();
        const commentId = parseInt((await params).comentId);

        const comment = await prisma.comment.findUnique({
            where: { id: commentId }
        });

        if (!comment) {
            return NextResponse.json(
                { message: "comment not found" },
                { status: 404 }
            );
        }

        const userPayload = await authincatedAndAuthorize(
            request,
            ["ADMIN", "USER"]
        );

        if (!userPayload) {
            return NextResponse.json(
                { message: "Forbidden" },
                { status: 403 }
            );
        }

        const validation = commentSchema.safeParse({ content });

        if (!validation.success) {
            return NextResponse.json(
                { message: validation.error.issues[0].message },
                { status: 400 }
            );
        }

        const createdReplay = await prisma.reply.create({
            data: {
                content: validation.data.content,
                commentId,
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
            {
                message: "Created replay",
                createdReplay
            },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            {
                message: "internal server error",
                error: (error as Error).message
            },
            { status: 500 }
        );
    }
}


export async function GET(request:NextRequest, {params}:props) {
    try {
        const commentId = parseInt((await params).comentId)
        const comment = await prisma.comment.findUnique({
            where: { id: commentId }
        })

        if (!comment) {
            return NextResponse.json(
                { message: 'comment not found' },
                { status: 404 }
            )
        }

        // الذهاب لقاعدة البيانات لعرض التعليقات
        const replies = await prisma.reply.findMany({
            //و تعرضه و تكون غير حساسة لحالة الاحرف urlالشرط تأخذ الموجود ضمن ال
            where:{
                commentId
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
                _count:{
                    select:{
                        vote:true
                    }
                }
            }
        })
        return NextResponse.json({data:replies} , {status:200})
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