import React from "react";

const Comment = ({ comment }) => {
  return (
    <div className="border-b py-2">
      <strong>{comment.userId?.username}:</strong> {comment.text}
    </div>
  );
};

export default Comment;
