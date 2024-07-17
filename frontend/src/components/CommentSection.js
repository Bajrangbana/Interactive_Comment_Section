import React, { useEffect, useState } from "react";
import axios from "axios";
import Comment from "./Comment";
import "../CommentSection.css";

const CommentSection = () => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const fetchComments = async () => {
    const response = await axios.get("http://localhost:5030/comments");
    setComments(response.data);
  };

  const handlePostComment = async () => {
    if (newComment) {
      await axios.post("http://localhost:5030/comments", {
        username: "abc",
        text: newComment,
        parentId: null,
      });
      setNewComment("");
      fetchComments();
    } else alert("Enter a comment");
  };

  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <div className="comment-section">
      <h1>Interactive Comment Section</h1>
      <div className="new-comment">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button onClick={handlePostComment}>Post Comment</button>
      </div>
      <div>
        {comments.map((comment) => (
          <Comment
            key={comment._id}
            comment={comment}
            fetchComments={fetchComments}
          />
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
