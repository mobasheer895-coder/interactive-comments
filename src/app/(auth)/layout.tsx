import Link from "next/link"

export default function layoutAouth({children} : Readonly<{
    children : React.ReactNode
}>) {
    return (
        <section className="w-full h-full flex justify-center items-center bg-blue-700 py-4">
                {children}
        </section>
    )
}