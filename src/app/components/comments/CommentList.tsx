"use client"
import { useEffect, useState } from "react";
import CommentCard from "./CommentCard"
import { addComment, addReply, addVote, deleteComment, deleteVote, editComment, getComments } from "@/app/apiCalls/comment";
import CommentForm from "./CommentForm";
import Popup from "./PopUp";
import ReplyList from "./ReplyList";
import { toast } from "react-toastify";
import { CurrentUser, getCurrentUser } from "@/app/apiCalls/auth";

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
        vote: number;
    };
    vote: {
    id: number;
}[];
    hasVoted: boolean;
}

const CommentList = () => {
    const [comments, setComments] = useState<Comment[]>([]);

    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

    const [editingCommentId, setEditingCommentId] = useState<number | null>(null);

    const [deletingCommentId, setDeletingCommentId] = useState<number | null>(null);

    const [replyingCommentId, setReplyingCommentId] = useState<number | null>(null);

    const [showRepliesCommentId, setShowRepliesCommentId] = useState<number | null>(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [repliesVersion, setRepliesVersion] = useState(0);

    const [actionError, setActionError] = useState("");

const handleError = (error: unknown) => {
    if (error instanceof Error) {
        setActionError(error.message);
    } else {
        setActionError("Something went wrong.");
    }
};

    const handleCommentVote = async (commentId: number,value: 1 | -1) => {
        try {
            setActionError("")
            if (value === 1) {
        await addVote(commentId);
    } else {
        await deleteVote(commentId);
    }
        } catch (error) {
            handleError(error)
            throw error
        }
    };

    const handleAddComment = async (content:string) => {
        try {
            setActionError("")

            const response = await addComment({ content });


setComments((prev) => [response.createdComment, ...prev]);
toast.success('created comment succesfully')
        } catch (error) {
            handleError(error)
            throw error
        }
    };

    const handleEditComment = async (id:number , content:string) => {
        try {
            setActionError("")
            const updatedComment = await editComment(
        { content },
        id.toString()
    );

    setComments((prev) =>
        prev.map((comment) =>
            comment.id === id
                ? updatedComment.comment
                : comment
        )
    )
    toast.success("Comment updated successfully!")
        } catch (error) {
            handleError(error);
        }
    };

    const handleDeleteComment = (id: number) => {
        console.log("Delete clicked:", id);
        setDeletingCommentId(id);
    };

    const handleConfirmDelete = async () => {
        if (deletingCommentId === null) return;

        try {
            setActionError("")
            await deleteComment(deletingCommentId.toString());

        setComments((prev) =>
            prev.filter((comment) => comment.id !== deletingCommentId)
        );

        setDeletingCommentId(null);
        toast.success("Comment deleted successfully!");
        } catch (error) {
            handleError(error)
            throw error
        }
    };

    const handleAddReply = async (commentId:number , content:string) => {
        try {
            setActionError("")
            await addReply({content} , commentId.toString())

        setRepliesVersion((prev) => prev + 1)
        } catch (error) {
            handleError(error)
            throw error
        }
    };

    useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        setError("");
        try {
            const user = await getCurrentUser();
            const data = await getComments();
            setCurrentUser(user)
            setComments(
                data.map((comment: Omit<Comment, "hasVoted">) => ({
                    ...comment,
                    hasVoted: comment.vote.length > 0,
                }))
            );
        } catch (error) {
            console.error("Failed to load comments:", error)
            setError("Failed to load comments.")
        }
        finally {
            setLoading(false);
        }
    };

    fetchData();
}, []);

    if (loading) {
    return <p>Loading comments...</p>;
}

if (error) {
    return <p>{error}</p>;
}

        return (
        <div className="bg-gray-200 flex flex-col gap-4 items-center p-15">
            {actionError && (
                <p>{actionError}</p>
            )}
            {comments.map((comment) => {
                console.log({
    currentUserId: currentUser?.id,
    commentUserId: comment.user.id,
    currentUserRole: currentUser?.role,
    canManageComment:
        currentUser !== null &&
        (currentUser.id === comment.user.id ||
            currentUser.role === "ADMIN"),
});
                const canManageComment =
        currentUser !== null &&
        (currentUser.id === comment.user.id ||
            currentUser.role === "ADMIN");
                return(
                    <div key={comment.id} className="">
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
                            onReply={() => setReplyingCommentId(comment.id)}
                            onShowReplies={() =>
                                setShowRepliesCommentId((prev) =>
                                    prev === comment.id ? null : comment.id
                                )
                            }
                        />
                    )}
                    {showRepliesCommentId === comment.id && (
                        <ReplyList 
                        commentId={comment.id}
                        repliesVersion={repliesVersion}
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
            <CommentForm
    submitText="Add Comment"
    placeholder="Write a comment..."
    onSubmit={handleAddComment}
/>
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
