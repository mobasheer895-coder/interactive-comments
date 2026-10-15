"use client"
import { useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import AuthForm from "@/app/components/auth/AuthForm"
import { DOMAIN } from "@/utils/constant"
import { toast } from "react-toastify"

export interface LoginData {
    email :string
    password : string
}

const Login = () => {
    const router = useRouter();
    const [data , setData] = useState<LoginData>({email : '' , password : ''})

    const handleSubmit = async (formValues: LoginData) => {

    try {
        const res = await axios.post(`${DOMAIN}/api/login`, {
                email:formValues.email,
                password:formValues.password
            }
        );
        console.log(res.data)
        router.push('/coments')
        toast.success('your login succefolly')
    } catch (error) {
        if (axios.isAxiosError(error)) {
        console.error("Login error:", error.response?.status);
        console.error("Error response:", error.response?.data);
    } else {
        console.error(error);
    }
    }
};

    const inputs = [
        {
            label : 'Email Addres',
            placeHolder : 'Example@gmail.com',
            type : 'email',
            name : 'email'
        },
        {
            label : 'password',
            placeHolder : '*******',
            type : 'password',
            name : 'password'
        }
    ]
    const footerData = {
        footerContent: "Don't have an Acount?",
        link: {
            url: "/register",
            contentLink: "Creat Acount"
        }
    };
    return (
        <div>
            <AuthForm<LoginData>
            title="login to Acount"
            description="please neter your email and password to contenue"
            inputs={inputs}
            btn="Sign In"
            footerData={footerData}
            setData={setData}
            onSubmit={handleSubmit}
            />
        </div>
    )
}

export default Login
