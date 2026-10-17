import { authincatedAndAuthorize } from "@/app/midelware/authincatedAndAuthorize";
import { prisma } from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";

export interface props {
    params: Promise<{
        comentId: string;
        replyId: string;
    }>;
}

// إضافة Vote للـ Reply
export async function POST(request: NextRequest, { params }: props) {
    try {
        const commentId = parseInt((await params).comentId);
        const replyId = parseInt((await params).replyId);

        const userPayload = await authincatedAndAuthorize(request,["ADMIN" , "USER"])

        if (!userPayload) {
            return NextResponse.json(
                { message: "Forbidden" },
                { status: 403 }
            );
        }

        // التأكد من وجود الـ Reply
        const reply = await prisma.reply.findUnique({
            where: {
                id: replyId
            }
        });

        if (!reply) {
            return NextResponse.json(
                { message: "reply not found" },
                { status: 404 }
            );
        }

        // التأكد أن الـ Reply تابع للـ Comment الموجود في الرابط
        if (reply.commentId !== commentId) {
            return NextResponse.json(
                { message: "reply does not belong to this comment" },
                { status: 400 }
            );
        }

        // التأكد أن المستخدم لم يصوت مسبقًا
        const vote = await prisma.vote.findUnique({
            where: {
                userId_replyId: {
                    userId: userPayload.userId,
                    replyId: replyId
                }
            }
        });

        if (vote) {
            return NextResponse.json(
                { message: "vote already exists" },
                { status: 409 }
            );
        }

        const newVote = await prisma.vote.create({
            data: {
                userId: userPayload.userId,
                replyId: replyId,
                vote: 1
            }
        });

        return NextResponse.json(
            {
                message: "created vote successfully",
                vote: newVote
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

// حذف Vote من الـ Reply
export async function DELETE(request: NextRequest, { params }: props) {
    try {
        const commentId = parseInt((await params).comentId);
        const replyId = parseInt((await params).replyId);

        const userPayload = await authincatedAndAuthorize(request,["ADMIN" , "USER"])

        if (!userPayload) {
            return NextResponse.json(
                { message: "Forbidden" },
                { status: 403 }
            );
        }

        // التأكد من وجود الـ Reply
        const reply = await prisma.reply.findUnique({
            where: {
                id: replyId
            }
        });

        if (!reply) {
            return NextResponse.json(
                { message: "reply not found" },
                { status: 404 }
            );
        }

        // التأكد أن الـ Reply تابع للـ Comment الموجود في الرابط
        if (reply.commentId !== commentId) {
            return NextResponse.json(
                { message: "reply does not belong to this comment" },
                { status: 400 }
            );
        }

        const vote = await prisma.vote.findUnique({
            where: {
                userId_replyId: {
                    userId: userPayload.userId,
                    replyId: replyId
                }
            }
        });

        if (!vote) {
            return NextResponse.json(
                { message: "vote not found" },
                { status: 404 }
            );
        }

        const deletedVote = await prisma.vote.delete({
            where: {
                userId_replyId: {
                    userId: userPayload.userId,
                    replyId: replyId
                }
            }
        });

        return NextResponse.json(
            {
                message: "deleted vote successfully",
                vote: deletedVote
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

// معرفة هل المستخدم الحالي صوّت على الـ Reply
export async function GET(
    request: NextRequest,
    { params }: props
) {
    try {
        const commentId = parseInt((await params).comentId);
        const replyId = parseInt((await params).replyId);

        const userPayload = await authincatedAndAuthorize(request)

        if (!userPayload) {
            return NextResponse.json(
                { message: "Forbidden" },
                { status: 403 }
            );
        }

        // التأكد من وجود الـ Reply
        const reply = await prisma.reply.findUnique({
            where: {
                id: replyId
            }
        });

        if (!reply) {
            return NextResponse.json(
                { message: "reply not found" },
                { status: 404 }
            );
        }

        // التأكد أن الـ Reply تابع للـ Comment الموجود في الرابط
        if (reply.commentId !== commentId) {
            return NextResponse.json(
                { message: "reply does not belong to this comment" },
                { status: 400 }
            );
        }

        const vote = await prisma.vote.findUnique({
            where: {
                userId_replyId: {
                    userId: userPayload.userId,
                    replyId: replyId
                }
            }
        });
        const hasVoted = vote !== null;
        return NextResponse.json(
            {
                hasVoted
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