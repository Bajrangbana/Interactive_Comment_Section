import React, { useState } from "react";
import axios from "axios";
import "../CommentSection.css";

const Comment = ({ comment, fetchComments }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState(comment.text);
  const [replyText, setReplyText] = useState("");
  const [showReply, setShowReply] = useState(false);

  const handleEdit = async () => {
    if (comment._id) {
      await axios.put(`http://localhost:5030/comments/${comment._id}`, {
        text: newText,
      });
      setIsEditing(false);
      fetchComments();
    } else alert("Something went wrong");
  };

  const handleDelete = async () => {
    if (comment._id) {
      await axios.delete(`http://localhost:5030/comments/${comment._id}`);
      fetchComments();
    } else alert("Something went wrong");
  };

  const handleReply = async () => {
    if (replyText) {
      await axios.post("http://localhost:5030/comments", {
        username: "abc",
        text: replyText,
        parentId: comment._id,
      });
      setReplyText("");
      setShowReply(false);
      fetchComments();
    } else alert("Enter a comment");
  };

  return (
    <div className={`comment ${comment.parentId ? "comment-reply" : ""}`}>
      {isEditing ? (
        <div>
          <textarea
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
          />
          <button onClick={handleEdit}>Save</button>
        </div>
      ) : (
        <p>{comment.text}</p>
      )}
      <small>by {comment.username}</small>
      <div>
        <button onClick={() => setIsEditing(true)}>Edit</button>
        <button onClick={handleDelete}>Delete</button>
        <button onClick={() => setShowReply(!showReply)}>Reply</button>
      </div>
      {showReply && (
        <div>
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
          <button onClick={handleReply}>Submit</button>
        </div>
      )}
      {comment.children &&
        comment.children.map((child) => (
          <Comment
            key={child._id}
            comment={child}
            fetchComments={fetchComments}
          />
        ))}
    </div>
  );
};

export default Comment;
