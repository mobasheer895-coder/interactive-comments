"use client"
import { addReplyVote, deleteReply, deleteReplyVote, editReply, getReplies } from "@/app/apiCalls/comment";
import { useEffect, useState } from "react";
import CommentForm from "./CommentForm";
import CommentCard from "./CommentCard";
import Popup from "./PopUp";
import { toast } from "react-toastify";

interface Reply {
    id: number;
    content: string;
    createdAt: string;
    user: {
        id: number;
        name: string;
        image: string;
    };
    _count: {
        vote: number;
    };
    hasVoted: boolean;
}

interface ReplyListProps {
    repliesVersion: number;
    commentId: number;
}
const ReplyList = ({commentId , repliesVersion}:ReplyListProps) => {

    const [replies, setReplies] = useState<Reply[]>([]);

    const [editingReplyId, setEditingReplyId] = useState<number | null>(null);

    const [deletingReplyId, setDeletingReplyId] = useState<number | null>(null);

    const [loading, setLoading] = useState(true);


    const [actionError, setActionError] = useState("");

    const handleError = (error: unknown) => {
    if (error instanceof Error) {
        setActionError(error.message);
    } else {
        setActionError("Something went wrong.");
    }
};

useEffect(() => {
    const fetchReplies = async () => {
        try {
            setLoading(true);

            const data = await getReplies(commentId.toString());
            console.log("Replies data:", data.data);
            setReplies(data.data);
        } catch (error) {
    console.error("Failed to load replies:", error);

} finally {
            setLoading(false);
        }
    };

    fetchReplies();
}, [commentId , repliesVersion]);

    const handleReplyVote = async (replyId: number,value: 1 | -1) => {
            try {
                setActionError("")
                if (value === 1) {
                await addReplyVote(commentId,replyId);
            } else {
                await deleteReplyVote(commentId,replyId);
            }
            } catch (error) {
                toast.error(
            value === 1
                ? "Failed to submit your vote."
                : "Failed to remove your vote."
        );
                throw error
            }
        }


        const handleEditReply = async (replyId:number , content:string) => {
                try {
                    setActionError("")
                    const updatedReply = await editReply(
                        { content },
                        commentId.toString(),
                        replyId.toString()
                    );

                    setReplies((prev) =>
                        prev.map((reply) =>
                            reply.id === replyId ? updatedReply.reply : reply
                        )
                    );
                } catch (error) {
                    handleError(error)
                    throw error
                }

            };
        
            const handleDeleteReply = (replyId: number) => {
                setDeletingReplyId(replyId);
            };
        
            const handleConfirmDelete = async () => {
            if (deletingReplyId === null) return
        
            try {
                setActionError("")
                await deleteReply(commentId.toString(),deletingReplyId.toString())
        
            setReplies((prev) =>
                prev.filter((reply) => reply.id !== deletingReplyId)
            );
        
            setDeletingReplyId(null)
            } catch (error) {
                handleError(error)
                throw error
            }
        }
        if (loading) {
            return <p>Loading replies...</p>
        }

    return (
        <div>
            {replies.map((reply) => (
                <div key={reply.id}>
                    {editingReplyId === reply.id ? (
                        <CommentForm
                            initialContent={reply.content}
                            submitText="Update"
                            placeholder="Edit your reply..."
                            onSubmit={(content) =>
                                handleEditReply(reply.id, content)
                            }
                            onSuccess={() => setEditingReplyId(null)}
                        />
                    ) : (
                        <CommentCard
                            id={reply.id}
                            content={reply.content}
                            createdAt={reply.createdAt}
                            user={reply.user}
                            voteCount={reply._count.vote}
                            hasVoted={reply.hasVoted}
                            onVote={(value) => handleReplyVote(reply.id, value)}
                            onEdit={() => setEditingReplyId(reply.id)}
                            onDelete={() => handleDeleteReply(reply.id)}
                        />
                    )}

                </div>
            ))}
            {actionError && <p>{actionError}</p>}
                {deletingReplyId !== null && (
                    <Popup
                        type="delete"
                        onConfirm={handleConfirmDelete}
                        onClose={() => setDeletingReplyId(null)}
                    />
                )}
        </div>
    )
}

export default ReplyList
