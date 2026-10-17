"use client";

import { useState } from "react";
import { toast } from "react-toastify";

interface VoteButtonProps {
    voteCount: number;
    hasVoted: boolean;
    onVote: (value: 1 | -1) => Promise<void>;
}

const VoteButton = ({voteCount , hasVoted , onVote}: VoteButtonProps) => {
    const [currentVoteCount, setCurrentVoteCount] = useState(voteCount);
    const [currentHasVoted, setCurrentHasVoted] = useState(hasVoted);



    const handleAddVote = async () => {
        if (currentHasVoted) {
            toast.error('You have already voted on this comment.')
        }

        try {
        await onVote(1);
        setCurrentVoteCount((prev) => prev + 1);
        setCurrentHasVoted(true);
        toast.success("Your vote has been recorded successfully.");
    } catch (error) {
        if (
            !(error instanceof Error &&
            error.message === "Authentication required")
    ) {
        toast.error("Failed to submit your vote");
    }
    }
    };

    const handleDeleteVote = async () => {
    try {
        await onVote(-1)
        setCurrentVoteCount((prev) => prev - 1)
        setCurrentHasVoted(false)
        toast.success("Your vote has been removed successfully.");
    } catch (error) {
            if (
            !(error instanceof Error &&
            error.message === "Authentication required")
        ) {
            toast.error("Failed to submit your vote");
        }
    }
};

    return (
        <div className="flex flex-col gap-4 bg-blue-50 p-2 text-blue-800 font-semibold rounded-lg">
            <button onClick={handleAddVote} className="cursor-pointer">+</button>

            <span>{currentVoteCount}</span>

            <button onClick={handleDeleteVote} className="cursor-pointer">-</button>
        </div>
    );
};

export default VoteButton;