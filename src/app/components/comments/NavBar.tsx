import { logout } from "@/app/apiCalls/auth";
import { clearCurrentUser } from "@/app/redux/slices/authSlice";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Popup from "./PopUp";
import { useState } from "react";

interface NavBarProps {
    logo: string
    onAddCommentClick: () => void
    btn: string
}

const NavBar = ({logo , onAddCommentClick , btn}:NavBarProps) => {
    const dispatch = useDispatch()
    const router = useRouter()
    const [showLogoutPopup,setShowLogoutPopup] = useState(false)
    const handleLogout = async () => {
    try {
    await logout()
    dispatch(clearCurrentUser())
    setShowLogoutPopup(false)
    toast.success("logout succefully")
    router.replace('/login')

    } catch (error) {
      console.error("Logout failed:", error)
      toast.error("Failed to log out")
    }
  }
    return (
        <>
            <nav className="fixed z-50 w-full flex justify-between items-center p-4 bg-gray-300">
            <h1>{logo}</h1>
            <div className="flex gap-5">
                <ul>
                <li>
                    <button onClick={onAddCommentClick} className="p-2 bg-blue-300 rounded-xl cursor-pointer transition-all hover:bg-blue-500 hover:scale-110 hover:text-white">
                        Add Comment
                    </button>
                </li>
            </ul>
            <button onClick={() => setShowLogoutPopup(true)} className="bg-red-400 p-2 rounded-xl cursor-pointer transition-all hover:bg-red-600 hover:scale-110 hover:text-white">
                {btn}
            </button>
            </div>
            
        </nav>
        {showLogoutPopup && (
            <Popup
                type='logout'
                onClose={() => setShowLogoutPopup(false)}
                onConfirm={handleLogout}
            />
        )}
        </>
    )
}

export default NavBar
