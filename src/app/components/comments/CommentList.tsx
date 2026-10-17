"use client"
import { RefObject, useEffect, useState } from "react";
import CommentCard from "./CommentCard"
import { addComment, addReply, addVote, deleteComment, deleteVote, editComment, getComments } from "@/app/apiCalls/comment";
import CommentForm from "./CommentForm";
import Popup from "./PopUp";
import ReplyList from "./ReplyList";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { addComent, addReplyAction, deleteComent, editComent, setComents, setCommentsError, setCommentsLoading } from "@/app/redux/slices"
import type { CurrentUser } from "@/app/apiCalls/auth";


interface Comment {
    id: number;
    content: string;
    createdAt: string;
    user: {
        id: number;
        name: string;
        image: string;
    };
    _count: {
        vote: number
        reply: number
    };
    vote: {
    id: number;
}[];
    hasVoted: boolean;
}
interface CommentListProps {
    addCommentRef: RefObject<HTMLDivElement | null>;
}
const CommentList = ({addCommentRef}:CommentListProps) => {

    const dispatch = useDispatch();

    const comments : Comment[] = useSelector((state: any) => state.comments.comments)

    const currentUser : CurrentUser|null = useSelector((state:any) => state.auth.currentUser)
    

    const loading = useSelector((state:any) => state.comments.commentLoading)

    const error = useSelector((state:any) => state.comments.commentError)

    const [editingCommentId, setEditingCommentId] = useState<number | null>(null);

    const [deletingCommentId, setDeletingCommentId] = useState<number | null>(null);

    const [replyingCommentId, setReplyingCommentId] = useState<number | null>(null);

    const [showRepliesCommentId, setShowRepliesCommentId] = useState<number | null>(null);

    const [actionError, setActionError] = useState("");

const handleError = (error: unknown) => {
    if (error instanceof Error) {
        setActionError(error.message);
    } else {
        setActionError("Something went wrong.");
    }
};

    const handleCommentVote = async (commentId: number,value: 1 | -1) => {
        if (!currentUser) {
            toast.error('please login')
            throw new Error("Authentication required")
        }
        try {
            setActionError("")
            if (value === 1) {
                await addVote(commentId)
            } else {
                await deleteVote(commentId);
            }
        } catch (error) {
            handleError(error)
            throw error
        }
    };

    const handleAddComment = async (content:string) => {
        if (!currentUser) {
            toast.error('please login')
            return;
        }
        try {
            setActionError("")

            const response = await addComment({ content });


dispatch(
    addComent({
        ...response.createdComment,
        hasVoted:false
    })
)
toast.success('created comment succesfully')
        } catch (error) {
            handleError(error)
            throw error
        }
    }

    const handleEditComment = async (id:number , content:string) => {
        try {
            setActionError("")
            const updatedComment = await editComment(
        { content },
        id.toString()
    );

    dispatch(editComent({
    ...updatedComment.comment,
    hasVoted: comments.find((comment) => comment.id === id)?.hasVoted ?? false,
}));
    toast.success("Comment updated successfully!")
        } catch (error) {
            handleError(error);
        }
    };

    const handleDeleteComment = (id: number) => {
        setDeletingCommentId(id);
    };

    const handleConfirmDelete = async () => {
        if (deletingCommentId === null) return;

        try {
            setActionError("")
            await deleteComment(deletingCommentId.toString());

        dispatch(deleteComent(deletingCommentId));

        setDeletingCommentId(null);
        toast.success("Comment deleted successfully!");
        } catch (error) {
            handleError(error)
            throw error
        }
    };

const handleAddReply = async (commentId: number, content: string) => {
    if (!currentUser) {
        toast.error("Please login");
        return;
    }
    try {
        setActionError("");

        const response = await addReply(
            { content },
            commentId.toString()
        );

        dispatch(
            addReplyAction({
                commentId,
                reply: response.createdReplay,
            })
        );
        toast.success('created reply')
    } catch (error) {
        handleError(error);
        throw error;
    }
}

    useEffect(() => {
    const fetchData = async () => {
        dispatch(setCommentsLoading(true))
        dispatch(setCommentsError(""))
        try {
            const data = await getComments()
            dispatch(
                setComents(
                data.map((comment: Omit<Comment, "hasVoted">) => ({
                    ...comment,
                    hasVoted: comment.vote.length > 0,
                }))
            )
            )
        } catch (error) {
            dispatch(setCommentsError("Failed to load comments."))
        }
        finally {
            dispatch(setCommentsLoading(false))
        }
    };

    fetchData();
}, [dispatch]);

    if (loading) {
    return <p>Loading comments...</p>;
}

if (error) {
    return <p>{error}</p>;
}

        return (
        <div className="bg-gray-200 flex flex-col gap-5 items-center p-15 mt-8">
            {actionError && (
                <p>{actionError}</p>
            )}
            {comments.map((comment) => {
                const canManageComment = currentUser !== null && (currentUser.id === comment.user.id || currentUser.role === "ADMIN")
                return(
                    <div key={comment.id} >
                    {editingCommentId === comment.id ? (
                        <CommentForm
                            initialContent={comment.content}
                            submitText="Update"
                            placeholder="Edit your comment..."
                            onSubmit={(content) =>
                                handleEditComment(comment.id, content)
                            }
                            
                            onSuccess={() => setEditingCommentId(null)}
                        />
                    ) : (
                        
                        <CommentCard
                            id={comment.id}
                            content={comment.content}
                            createdAt={comment.createdAt}
                            user={comment.user}
                            voteCount={comment._count.vote}
                            hasVoted={comment.hasVoted}
                            onVote={(value) => handleCommentVote(comment.id, value)}
                            onEdit={
                                canManageComment
                                    ? () => setEditingCommentId(comment.id)
                                    : undefined
                            }
                            onDelete={
                                canManageComment
                                    ? () => handleDeleteComment(comment.id)
                                    : undefined
                            }
                            onReply={() => {
                                if (!currentUser) {
                                    toast.error("Please login")
                                    return;
                                }

                                setReplyingCommentId(comment.id);
                            }}
                            onShowReplies={() =>
                                setShowRepliesCommentId((prev) =>
                                    prev === comment.id ? null : comment.id
                                )
                            }
                            repliesCount={comment._count.reply}
                        />
                    )}
                    {showRepliesCommentId === comment.id && (
                        <ReplyList 
                        commentId={comment.id}
                        />
                    )}

                    {replyingCommentId === comment.id && (
                        <CommentForm
                            submitText="Reply"
                            placeholder="Write a reply..."
                            onSubmit={(content) =>
                                handleAddReply(comment.id, content)
                            }
                            onSuccess={() => setReplyingCommentId(null)}
                        />
                    )}
                </div>
                )
})}
            <div ref={addCommentRef}>
                <CommentForm
                    submitText="Add Comment"
                    placeholder="Write a comment..."
                    onSubmit={handleAddComment}
                />
            </div>
                {deletingCommentId !== null && (
                    <Popup
                        type="delete"
                        onConfirm={handleConfirmDelete}
                        onClose={() => setDeletingCommentId(null)}
                    />
                )}
        </div>
    )
}

export default CommentList
