
import { createSlice } from "@reduxjs/toolkit";

export interface Comment {
    id: number;
    content: string;
    userId: number;
    createdAt: string;
    updatedAt: string;
    user: {
        id: number;
        name: string;
        image: string | null;
    }
    _count: {
        vote: number;
    }
    hasVoted: boolean;
}

export interface Reply {
    id: number;
    content: string;
    userId: number;
    commentId: number;
    createdAt: string;
    updatedAt: string;
    user: {
        id: number;
        name: string;
        image: string | null;
    };
    _count: {
        vote: number;
    };
    hasVoted: boolean;
}

export interface initialStateProps {
    comments: Comment[];
    replies: Record<number, Reply[]>;
}

const initialState: initialStateProps = {
    comments: [],
    replies: {},
};

const commentsSlice = createSlice({
    name: "comments",
    initialState,
    reducers: {
        setComents: (state, action) => {
            state.comments = action.payload;
        },

        addComent: (state, action) => {
            state.comments.unshift(action.payload);
        },

        deleteComent: (state, action) => {
            state.comments = state.comments.filter(
                (comment) => comment.id !== action.payload
            );
        },

        editComent: (state, action) => {
            state.comments = state.comments.map((comment) =>
                comment.id === action.payload.id
                    ? action.payload
                    : comment
            );
        },

        setRepliesAction: (state, action) => {
            state.replies[action.payload.commentId] =
                action.payload.replies;
        },

        addReplyAction: (state, action) => {
            const { commentId, reply } = action.payload;

            if (!state.replies[commentId]) {
                state.replies[commentId] = [];
            }

            state.replies[commentId].unshift(reply);
        },

        editReplyAction: (state, action) => {
            const { commentId, reply } = action.payload;

            if (!state.replies[commentId]) {
                return;
            }

            state.replies[commentId] = state.replies[commentId].map(
                (item) => item.id === reply.id ? reply : item
            );
        },

        deleteReplyAction: (state, action) => {
            const { commentId, replyId } = action.payload;

            if (!state.replies[commentId]) {
                return;
            }

            state.replies[commentId] = state.replies[commentId].filter(
                (reply) => reply.id !== replyId
            );
        },
        voteReplyAction: (state, action) => {
    const { commentId, replyId, value } = action.payload;
    const replies = state.replies[commentId];

    if (!replies) return;

    const reply = replies.find((item) => item.id === replyId);

    if (!reply) return;

    if (value === 1 && !reply.hasVoted) {
        reply._count.vote += 1;
        reply.hasVoted = true;
    } else if (value === -1 && reply.hasVoted) {
        reply._count.vote = Math.max(0, reply._count.vote - 1);
        reply.hasVoted = false;
    }
},
    },
});

export const {setComents,addComent,deleteComent,editComent,setRepliesAction,addReplyAction,editReplyAction,deleteReplyAction,voteReplyAction} = commentsSlice.actions;

export default commentsSlice.reducer;
