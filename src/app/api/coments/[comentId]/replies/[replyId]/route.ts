import { NextRequest, NextResponse } from "next/server"
import { authincatedAndAuthorize } from "@/app/midelware/authincatedAndAuthorize"
import { prisma } from "@/utils/prisma"
import { commentSchema } from "@/utils/validations"
export interface props {
    params: Promise<{
        comentId:string , 
        replyId:string}
        >
}
export async function PUT(request:NextRequest , {params}:props) {
try {
    const { content } = await request.json()
    const commentId = parseInt((await params).comentId)
    const replyId = parseInt((await params).replyId)

    const userPayload = await authincatedAndAuthorize(request,["ADMIN" , "USER"])
    
        if (!userPayload) {
                return NextResponse.json({message:'Forbidden'} , {status:403})
            }

            const reply = await prisma.reply.findUnique({
                where:{id:replyId}
            })

            if (reply?.commentId !== commentId) {
                return NextResponse.json(
                    {message:'reply not found'},
                    {status:404}
                )
            }

            if (userPayload.role !== 'ADMIN' && reply.userId !== userPayload.userId) {
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
            const updateReply = await prisma.reply.update({
                            data:{content},
                            where:{id:replyId},
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
                        })

                        return NextResponse.json(
                            {reply:updateReply},
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
        const commentId = parseInt((await params).comentId)
    const replyId = parseInt((await params).replyId)

    const userPayload = await authincatedAndAuthorize(request,["ADMIN" , "USER"])
    
        if (!userPayload) {
                return NextResponse.json({message:'Forbidden'} , {status:403})
            }

            const reply = await prisma.reply.findUnique({
                where:{id:replyId}
            })

            if (reply?.commentId !== commentId) {
                return NextResponse.json(
                    {message:'reply not found'},
                    {status:404}
                )
            }

            if (userPayload.role !== 'ADMIN' && reply.userId !== userPayload.userId) {
                return NextResponse.json(
                    {message:'invalid user'},
                    {status:403}
                )
            }

            const deletereply = await prisma.reply.delete({
                where:{id:replyId}
            })
            return NextResponse.json(
                {message:'deleted succes' , deletereply},
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