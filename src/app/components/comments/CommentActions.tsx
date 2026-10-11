import { FaReply } from "react-icons/fa"
import { MdDelete, MdEdit } from "react-icons/md"

interface CommentActionsProps {
    onEdit?: () => void
    onDelete?: () => void
    onReply?: () => void
}

const CommentActions = ({onEdit,onDelete,onReply,}: CommentActionsProps) => {
    return (
        <div>
            {onReply && <button onClick={onReply} className="text-blue-800 flex items-center gap-2 font-bold cursor-pointer hover:scale-125 transition-all"><FaReply className="text-xl" />Reply</button>}
            {onEdit && <button onClick={onEdit} className="flex items-center font-bold gap-2 text-blue-800 cursor-pointer hover:scale-125 transition-all"><MdEdit className="text-xl" />Edit</button>}
            {onDelete && <button onClick={onDelete} className="text-red-600 font-bold flex items-center cursor-pointer hover:scale-125 transition-all"><MdDelete className="text-xl" />Delete</button>}
        </div>
    )
}

export default CommentActions
