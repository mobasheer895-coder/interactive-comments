import { authincatedAndAuthorize } from "@/app/midelware/authincatedAndAuthorize";
import { prisma } from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";
export interface props {
    params: Promise<{
        comentId: string;
    }>
}
export async function POST(request:NextRequest , {params}:props) {
    try {

        const comentId = parseInt((await params).comentId)

        const userPayload = await authincatedAndAuthorize(request)

        if (!userPayload) {
            return NextResponse.json({message:'Forbidden'} , {status:403})
        }

        const coment = await prisma.comment.findUnique({
                where:{id:comentId}
            })

            if (!coment) {
                return NextResponse.json(
                    {message:'comment not found'},
                    {status:404}
                )
            }

            const vote = await prisma.vote.findUnique({
                where:{
                    userId_commentId:{
                        userId:userPayload.userId,
                        commentId:comentId
                    }
                }
            })

            if (vote) {
                return NextResponse.json(
                    { message: "vote already exists" },
                    { status: 409 }
                )
            }

            const newVote = await prisma.vote.create({
                data:{
                    userId:userPayload.userId,
                    commentId:comentId,
                    vote:1
                }
            })

            return NextResponse.json(
                {
                    message: "created vote successfully",
                    vote: newVote
                },
                { status: 201 }
            )
    } catch (error) {
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

        const userPayload = await authincatedAndAuthorize(request)

        if (!userPayload) {
            return NextResponse.json({message:'Forbidden'} , {status:403})
        }

        const vote = await prisma.vote.findUnique({
                where:{
                    userId_commentId:{
                        userId:userPayload.userId,
                        commentId:comentId
                    }
                }
            })

            if (!vote) {
                return NextResponse.json(
                    { message: "vote not found" },
                    { status: 404 }
                )
            }

            const deletedVote = await prisma.vote.delete({
                where:{
                    userId_commentId:{
                        userId:userPayload.userId,
                        commentId:comentId
                    }
                }
            })

            return NextResponse.json(
                {
                    message: "deleted vote successfully",
                    vote: deletedVote
                },
                { status: 200 }
            )
    } catch (error) {
        return NextResponse.json(
                {
                    message:'internal server error',
                    error:(error as Error).message
                },
                {status:500}
            )
    }
}

export async function GET(request: NextRequest, { params }: props) {
    try {
        const comentId = parseInt((await params).comentId);

        const userPayload = await authincatedAndAuthorize(request);

        if (!userPayload) {
            return NextResponse.json(
                { message: "Forbidden" },
                { status: 403 }
            );
        }

        const vote = await prisma.vote.findUnique({
            where: {
                userId_commentId: {
                    userId: userPayload.userId,
                    commentId: comentId
                }
            }
        });

        return NextResponse.json(
            {
                hasVoted: !!vote
            },
            { status: 200 }
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