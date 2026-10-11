import { jwtPayload } from "@/utils/types";
import { verifyToken } from "@/utils/verifyToken";
import { cookies } from "next/headers";

export async function authincatedAndAuthorize(
    request:Request,
    allowRoles?:string[])
    :Promise<jwtPayload|null> {
    try {
        // جلب قيمة التوكن من الكوكيز
        const token = (await cookies()).get('jwtToken')?.value
        // اذا التوكن غير موجود لا يعيد له شيئ
        if (!token) {
            return null
        }
        // جلب بيانات التوكن بعد التحقق منها
        const userPayload = verifyToken(token)
        // اذا البيانات غير مطابقة لا يعيد له شيئ
        if (!userPayload) {
            return null
        }
        // اذا مصفوفة الادوار غير مطابقة للدور الموجود في التوكن
        if (allowRoles && !allowRoles.includes(userPayload.role)) {
            // لا يرجع شيئ
            return null
        }
        // يرجع بيانات التوكن
        return userPayload
    } catch (error) {
        return null
    }
}