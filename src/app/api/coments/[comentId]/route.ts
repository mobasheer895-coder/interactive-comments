import { authincatedAndAuthorize } from "@/app/midelware/authincatedAndAuthorize";
import { prisma } from "@/utils/prisma";
import { commentSchema } from "@/utils/validations";
import { NextRequest, NextResponse } from "next/server";
interface props {
    params: Promise<{ comentId: string }>
}
export async function PUT(request:NextRequest , {params}:props) {
try {
    const { content } = await request.json()
        const commentId = parseInt((await params).comentId)

    const userPayload = await authincatedAndAuthorize(request,["ADMIN" , "USER"])
    
        if (!userPayload) {
                return NextResponse.json({message:'Forbidden'} , {status:403})
            }

            const comment = await prisma.comment.findUnique({
                where:{id:commentId}
            })

            if (!comment) {
                return NextResponse.json(
                    {message:'comment not found'},
                    {status:404}
                )
            }

            if (userPayload.role !== 'ADMIN' && comment.userId !== userPayload.userId) {
                return NextResponse.json(
                    {message:'invalid user'},
                    {status:403}
                )
            }
            const validition = commentSchema.safeParse({content})
                    // اذا لم تطابق الشروط تعيد رسالة الخطأ
                    if (!validition.success) {
                        return NextResponse.json(
                            { message: validition.error.issues[0].message },
                            { status: 400 }
                        );
                    }
            const updateComment = await prisma.comment.update({
    data: { content },
    where: { id: commentId },
    include: {
        user: {
            select: {
                id: true,
                name: true,
                image: true,
            },
        },
        _count: {
            select: {
                vote: true,
            },
        },
    },
});

                        return NextResponse.json(
                            {comment:updateComment},
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

export async function DELETE(request:NextRequest , {params}:props) {
    try {
        const comentId = parseInt((await params).comentId)

    const userPayload = await authincatedAndAuthorize(request,["ADMIN" , "USER"])
    
        if (!userPayload) {
                return NextResponse.json({message:'Forbidden'} , {status:403})
            }

            const comment = await prisma.comment.findUnique({
                where:{id:comentId}
            })

            if (!comment) {
                return NextResponse.json(
                    {message:'comment not found'},
                    {status:404}
                )
            }

            if (userPayload.role !== 'ADMIN' && comment.userId !== userPayload.userId) {
                return NextResponse.json(
                    {message:'invalid user'},
                    {status:403}
                )
            }

            const deleteComment = await prisma.comment.delete({
                where:{id:comentId}
            })
            return NextResponse.json(
                {message:'deleted succes' , deleteComment},
                {status:200}
            )
    } catch (error) {
        return NextResponse.json(
            {
                message:'internal server error',
                error : (error as Error).message
            },
            {status:500}
        )
    }
}