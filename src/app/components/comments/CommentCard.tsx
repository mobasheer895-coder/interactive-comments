"use client";

import formatTimeAgo from "@/utils/formatTimeAgo";
import VoteButton from "./VoteButton";
import CommentActions from "./CommentActions";

interface CommentCardProps {
    id: number;
    content: string;
    createdAt: string;
    user: {
        id: number;
        name: string;
        image: string | null
    };
    voteCount: number;
    hasVoted: boolean;
    onVote: (value: 1 | -1) => Promise<void>;

    onEdit?: () => void;
    onDelete?: () => void;
    onReply?: () => void;
    onShowReplies?: () => void;

    repliesCount?: number;
}

const CommentCard = ({ content, createdAt, user, voteCount,hasVoted,repliesCount,
    onVote, onEdit, onDelete, onReply, onShowReplies,}: CommentCardProps) => {
    
return (
    <div className="bg-white p-3 rounded-lg w-lg">
        <div className="flex items-start gap-3">
            <VoteButton
                voteCount={voteCount}
                hasVoted={hasVoted}
                onVote={onVote}
            />

            <div className="flex-1">
                <div className="flex justify-between">
                    <div className="flex items-center gap-4">
                        <img
                        src={user.image || '/default-avatar.webp'}
                        alt=""
                        className="w-10 h-10 rounded-full object-cover"
                    />

                    <h2 className="text-gray-900">{user.name}</h2>
                    <p className="text-gray-500">{formatTimeAgo(createdAt)}</p>
                    </div>
                    <CommentActions
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onReply={onReply}
                />
                </div>

                <p className="mt-3">{content}</p>

                

                {repliesCount !== undefined &&
                    repliesCount > 0 &&
                    onShowReplies && (
                        <button onClick={onShowReplies}>
                            Show replies
                        </button>
                )}
            </div>
        </div>
    </div>
);

};

export default CommentCard;