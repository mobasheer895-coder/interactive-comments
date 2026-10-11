import { verifyToken } from "@/utils/verifyToken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        // جلب الكوكيز
        const cookieStore = await cookies();
        const token = cookieStore.get('jwtToken')?.value
                // اذا التوكن غير موجود  يعيد له رسالة خطأ
                if (!token) {
                    return NextResponse.json(
                    { message: "Unauthorized" },
                    { status: 401 }
                    );
                }
                // جلب بيانات التوكن بعد التحقق منها
                const userPayload = verifyToken(token)
                // اذا البيانات غير مطابقة  يعيد له رسالة خطأ
                if (!userPayload) {
                    return NextResponse.json(
                    { message: "Unauthorized" },
                    { status: 401 }
                    )
                }
                cookieStore.delete("jwtToken");
        // ارجاع رسالة نجاح العملية
        return NextResponse.json(
            { message: "logged out successfully" },
            { status: 200 }
        );

    } catch (error) {
        // إرجاع رسالة خطأ عند حدوث خطأ داخلي في السيرفر
        return NextResponse.json(
            {
                message: "internal server error",
                error: (error as Error).message
            },
            { status: 500 }
        );
    }
}