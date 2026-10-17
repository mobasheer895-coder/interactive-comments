"use client"
import { addReplyVote, deleteReply, deleteReplyVote, editReply, getReplies } from "@/app/apiCalls/comment";
import { useEffect, useState } from "react";
import CommentForm from "./CommentForm";
import CommentCard from "./CommentCard";
import Popup from "./PopUp";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { deleteReplyAction, editReplyAction, Reply, setRepliesAction, setRepliesError, setRepliesLoading, voteReplyAction } from "@/app/redux/slices";
import { CurrentUser } from "@/app/apiCalls/auth";


interface ReplyListProps {
    commentId: number;
}
const ReplyList = ({commentId}:ReplyListProps) => {
    const dispatch = useDispatch()

    const replies: Reply[] = useSelector((state: any) => state.comments.replies[commentId] ?? [])

    const currentUser : CurrentUser|null = useSelector((state:any) => state.auth.currentUser)

    const loading = useSelector((state:any) => state.comments.repliesLoading)

    const error = useSelector((state:any) => state.comments.repliesError)

    const [editingReplyId, setEditingReplyId] = useState<number | null>(null);

    const [deletingReplyId, setDeletingReplyId] = useState<number | null>(null);

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
        dispatch(setRepliesLoading(true))
        dispatch(setRepliesError(null))

        try {
            const data = await getReplies(commentId.toString())
            dispatch(
                    setRepliesAction({
                        commentId,
                        replies: data.data,
                    })
                );
        } catch (error) {
            dispatch(setRepliesError(
                error instanceof Error
                    ? error.message
                    : "Failed to load replies."
            ))

        } finally {
                    dispatch(setRepliesLoading(false))
                }
    };

    fetchReplies();
}, [commentId , dispatch]);

    const handleReplyVote = async (replyId: number,value: 1 | -1) => {
        if (!currentUser) {
            toast.error("Please login");
            throw new Error("Authentication required");
        }
    try {
        setActionError("");

        if (value === 1) {
            await addReplyVote(commentId, replyId);
        } else {
            await deleteReplyVote(commentId, replyId);
        }

        dispatch(
            voteReplyAction({
                commentId,
                replyId,
                value,
            })
        );
    } catch (error) {
        if (
            !(error instanceof Error &&
            error.message === "Authentication required")
        ) {
            toast.error(
                value === 1
                    ? "Failed to submit your vote."
                    : "Failed to remove your vote."
            );
        }

        throw error;
    }
};


        const handleEditReply = async (replyId:number , content:string) => {
                try {
                    setActionError("")
                    const updatedReply = await editReply(
                        { content },
                        commentId.toString(),
                        replyId.toString()
                    );

                    dispatch(
                editReplyAction({
                    commentId,
                    reply: updatedReply.reply,
                })
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
        
            dispatch(
                deleteReplyAction({
                    commentId,
                    replyId: deletingReplyId,
                })
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
        if (error) {
            return <p>{error}</p>
        }

    return (
    <div className="ml-6 mb-6">
        <div className="border-l-2 border-gray-300 flex flex-col self-stretch">
            {replies.map((reply) => {
                const canManageReply = currentUser !== null && (currentUser.role === "ADMIN" || currentUser.id === reply.user.id)
                return (
                    <div
                    key={reply.id}
                    className="relative pl-7 before:absolute before:top-17 before:left-0 before:w-10 before:border-t-2 before:border-gray-300"
                >
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
                        <div className="ml-3 mt-4">
                            <CommentCard
                            id={reply.id}
                            content={reply.content}
                            createdAt={reply.createdAt}
                            user={reply.user}
                            voteCount={reply._count.vote}
                            hasVoted={reply.hasVoted}
                            onVote={(value) => handleReplyVote(reply.id, value)}
                            onEdit={
                                canManageReply
                                    ? () => setEditingReplyId(reply.id)
                                    : undefined
                            }
                            onDelete={
                                canManageReply
                                    ? () => handleDeleteReply(reply.id)
                                    : undefined
                            }
                        />
                        </div>
                    )}
                </div>
                )
            })}
        </div>

        {actionError && <p>{actionError}</p>}

        {deletingReplyId !== null && (
            <Popup
                type="delete"
                onConfirm={handleConfirmDelete}
                onClose={() => setDeletingReplyId(null)}
            />
        )}
    </div>
);
}

export default ReplyList
