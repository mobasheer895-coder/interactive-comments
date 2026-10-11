import { NextResponse } from "next/server";
import { authincatedAndAuthorize } from "@/app/midelware/authincatedAndAuthorize";

export async function GET(request: Request) {
    const userPayload = await authincatedAndAuthorize(request);

    if (!userPayload) {
        return NextResponse.json(
            { message: "Unauthorized" },
            { status: 401 }
        );
    }

    return NextResponse.json(
        {
            user: {
                id: userPayload.userId,
                role: userPayload.role,
            },
        },
        { status: 200 }
    );
}