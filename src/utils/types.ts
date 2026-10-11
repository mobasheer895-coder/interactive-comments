// البيانات الموجودة ضمن التوكن و انواعها
export type jwtPayload = {
    userId:number
    name?:string
    email: string
    role: string
}