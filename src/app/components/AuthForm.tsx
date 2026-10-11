import Link from "next/link";
import { useRef, type ChangeEvent, type Dispatch, type FormEvent, type ReactNode } from "react";

interface props<T> {
    title:string
    description: string;
    inputs: Array<{ label: string | ReactNode; placeHolder: string; type: string , name : string}>;
    btn?: string;
    footerData: {footerContent : string , link: {url : string , contentLink : string}}
    setData: Dispatch<React.SetStateAction<T>>
    register ?: boolean
    onSubmit: (data: T) => void | Promise<void>;
}

const AuthForm =<T extends object> ({title, description, inputs, btn, footerData , setData , register,onSubmit}: props<T>) => {
    const data = useRef<Partial<T>>({});
    const dataHandling =(event : ChangeEvent<HTMLInputElement>) => {
        const {name , value , files , type} = event.target
        data.current = {...data.current , [name] : type == "file" ? (files ? files[0] || null : null) : value}
    }
    const dataHandle = async (event : FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = data.current as T
        setData(formData)
        await onSubmit(formData)
    }
const formStyle = "h-136.5 bg-white rounded-3xl " 
    return (
        
        <form className={` max-w-2xl w-auto min-h-150 h-auto p-5 rounded-3xl flex flex-col justify-between 
        min-[300px]:max-[450px]:w-70
        
        ${formStyle}`} onSubmit={dataHandle}>
        <div className=" text-center mb-4 max-sm:mt-6">
            <h1>{title}</h1>
            <p>{description}</p>
        </div>
        <div className="flex flex-col justify-between flex-1">
<div className="grid gap-4">
    {inputs.map((input, index) => {
        

        return (
            <div key={index} >
                <label htmlFor={input.name} className={`block mb-1 ${input.type === "file" &&"cursor-pointer w-35"}`}>{input.label}</label>
                <input
                    id={input.name}
                    name={input.name}
                    type={input.type}
                    placeholder={input.placeHolder}
                    className={`bg-gray-200 w-full p-2 rounded-lg outline-none border border-gray-200  focus:border-2 focus:border-gray-300 ${input.type == "file" && "hidden"}`}
                    onChange={dataHandling}
                />
            </div>
        );
    })}
</div>

    <div className="text-center ">
        <input
            type="submit" 
            value={btn}
            className="mb-1.5 p-2 bg-blue-400 text-white text-2xl rounded-lg w-72 cursor-pointer min-[300px]:max-[450px]:w-50 min-[300px]:max-[450px]:p-1 "
        />
        <div className="flex justify-center gap-2 max-sm:flex-col">
            <p className="">{footerData?.footerContent}</p>
            <Link href={footerData.link.url} className="text-blue-600 underline">
                {footerData?.link.contentLink}
            </Link>
        </div>
    </div>
</div>
        </form>
    );
};

export default AuthForm;
