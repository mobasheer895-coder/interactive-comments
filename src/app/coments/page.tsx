"use client"
import { useRef } from "react";
import CommentList from "../components/comments/CommentList"
import NavBar from "../components/comments/NavBar"

const CommentsPage = () => {
    const addCommentRef = useRef<HTMLDivElement>(null);

    const handleScrollToAddComment = () => {
        addCommentRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };
    return (
        <div>
            <NavBar
                logo="Comments Platform"
                onAddCommentClick={handleScrollToAddComment}
                btn="Logout"
            />
            <CommentList addCommentRef={addCommentRef}/>
        </div>
    )
}

export default CommentsPage
