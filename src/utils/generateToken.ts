import jwt from "jsonwebtoken";
import { jwtPayload } from "./types";

export function generateJwt(jwtPayload:jwtPayload):string {
    // .env جلب مفتاح تشفير التوكن من ملف 
    const privateKey = process.env.JWT_SECRET as string
    // تحديد مدة صلاحية التوكن
    const token = jwt.sign(jwtPayload , privateKey , {
        expiresIn : '30d'
    })
    // ارجاع التوكن
    return token
}