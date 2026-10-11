import jwt from "jsonwebtoken";
import { jwtPayload } from "./types";

export function verifyToken(token:string | null): jwtPayload | null {
    try {
        // اذا لا يوجد توكن لا يرجع له شيئ
        if (!token) {
            return null
        }
        // .envمفتاح تشفير التوكن الذي يأتي من ملف الـ 
        const privateKey = process.env.JWT_SECRET as string
        // التحقق من بيانات التوكن من خلال مفتاح التشفير
        const userPayload = jwt.verify(token,privateKey) as jwtPayload
        // ارجاع بيانات الموجودة في التوكن
        return userPayload
    } catch (error) {
        return null
    }
}