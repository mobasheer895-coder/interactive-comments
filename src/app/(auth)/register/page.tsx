"use client"
import AuthForm from "@/app/components/auth/AuthForm";
import { DOMAIN } from "@/utils/constant";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react"
import { LiaUserCircle } from "react-icons/lia";
import { toast } from "react-toastify";



export interface SignUpData {
    name: string;
    email: string;
    password: string;
    image: File | null;
}

const Register = () => {
  const router = useRouter();
    const [data, setData] = useState<SignUpData>({
        name: "",
        email: "",
        password: "",
        image: null
    });

    const handleSubmit = async (formValues: SignUpData) => {
    const formData = new FormData();

    formData.append("name", formValues.name);
    formData.append("email", formValues.email);
    formData.append("password", formValues.password);

    if (formValues.image) {
        formData.append("image", formValues.image);
    }

    try {
        const res = await axios.post(`${DOMAIN}/api/register`,formData, {
                headers: {
                    Accept: "application/json",
                },
            }
        );

        console.log(res.data);
        router.push('/coments')
        toast.success('your regiserd succefully')
    } catch (error) {
        console.error(error);
    }
};



    const inputs = [
        {
            label: 'Full Name',
            placeHolder: 'Full Name',
            type: 'text',
            name: 'name'
        },
        {
            label: 'Email address',
            placeHolder: 'Example@gmail.com',
            type: 'email',
            name: 'email'
        },
        {
            label: 'password',
            placeHolder: '*********',
            type: 'password',
            name: 'password'
        },
        
        {
            label: <LiaUserCircle className="text-9xl" />,
            placeHolder: 'Profile Image',
            type: 'file',
            name: 'image'
        }
    ];

    const footerData = {
        footerContent: "Already have an Account?",
        link: {
            url: "/login",
            contentLink: "Login"
        }
    };

    return (
        <div>
            <AuthForm<SignUpData>
                title="Create an Account"
                description="Create an account to continue"
                inputs={inputs}
                btn="Sign Up"
                footerData={footerData}
                setData={setData}
                register={true}
                onSubmit={handleSubmit}
            />
        </div>
    );
};


export default Register;
