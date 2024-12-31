'use client'; // Needed for client-side hooks like useState and useEffect

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/navbar'; // Assuming you have a Navbar component

interface Comment {
  id: number;
  text: string;
  likes: number;
  dislikes: number;
  replies: Comment[]; // Nested replies
}

export default function BlogPost({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [post, setPost] = useState<{ title: string; body: string } | null>(
    null,
  );
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [editCommentId, setEditCommentId] = useState<number | null>(null);
  const [editCommentText, setEditCommentText] = useState('');
  const [replyCommentId, setReplyCommentId] = useState<number | null>(null);
  const [newReply, setNewReply] = useState('');

  // Unwrap params using React.use()
  const { id } = React.use(params);

  // Fetch the post data
  useEffect(() => {
    const fetchPost = async () => {
      const res = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${id}`,
      );
      const data = await res.json();
      setPost(data);
    };

    fetchPost();
  }, [id]);

  // Load comments from local storage
  useEffect(() => {
    const storedComments = localStorage.getItem(`comments-${id}`);
    if (storedComments) {
      setComments(JSON.parse(storedComments));
    }
  }, [id]);

  // Save comments to local storage
  useEffect(() => {
    localStorage.setItem(`comments-${id}`, JSON.stringify(comments));
  }, [comments, id]);

  const handleAddComment = () => {
    if (newComment.trim()) {
      const newCommentObj: Comment = {
        id: Date.now(),
        text: newComment.trim(),
        likes: 0,
        dislikes: 0,
        replies: [],
      };
      setComments([...comments, newCommentObj]);
      setNewComment('');
    }
  };

  const handleEditComment = (id: number, text: string) => {
    setEditCommentId(id);
    setEditCommentText(text);
  };

  const handleUpdateComment = () => {
    if (editCommentText.trim()) {
      setComments(
        comments.map((comment) =>
          comment.id === editCommentId
            ? { ...comment, text: editCommentText.trim() }
            : comment,
        ),
      );
      setEditCommentId(null);
      setEditCommentText('');
    }
  };

  const handleDeleteComment = (id: number) => {
    setComments(comments.filter((comment) => comment.id !== id));
  };

  const handleLikeComment = (id: number) => {
    setComments(
      comments.map((comment) =>
        comment.id === id ? { ...comment, likes: comment.likes + 1 } : comment,
      ),
    );
  };

  const handleDislikeComment = (id: number) => {
    setComments(
      comments.map((comment) =>
        comment.id === id
          ? { ...comment, dislikes: comment.dislikes + 1 }
          : comment,
      ),
    );
  };

  const handleReplyToComment = (id: number) => {
    setReplyCommentId(id);
  };

  const handleAddReply = (id: number) => {
    if (newReply.trim()) {
      const reply: Comment = {
        id: Date.now(),
        text: newReply.trim(),
        likes: 0,
        dislikes: 0,
        replies: [],
      };
      setComments(
        comments.map((comment) =>
          comment.id === id
            ? { ...comment, replies: [...comment.replies, reply] }
            : comment,
        ),
      );
      setNewReply('');
      setReplyCommentId(null);
    }
  };

  if (!post) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loader">Loading...</div>{' '}
        {/* You can replace this with a spinner or skeleton loader */}
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h1 className="text-4xl font-bold text-gray-800">{post.title}</h1>
          <p className="text-gray-700 mt-4">{post.body}</p>

          <div className="mt-8">
            <h2 className="text-3xl font-semibold">Comments</h2>
            <ul className="mt-4 space-y-4">
              {comments.map((comment) => (
                <li key={comment.id} className="border-b py-2">
                  <div className="flex justify-between items-center">
                    <div className="flex-grow">
                      {editCommentId === comment.id ? (
                        <div>
                          <input
                            type="text"
                            value={editCommentText}
                            onChange={(e) => setEditCommentText(e.target.value)}
                            className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <button
                            onClick={handleUpdateComment}
                            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                          >
                            Update
                          </button>
                        </div>
                      ) : (
                        <div>
                          <p>{comment.text}</p>
                          <div className="flex items-center mt-2">
                            <button
                              onClick={() => handleLikeComment(comment.id)}
                              className="text-blue-500 hover:underline mr-2"
                            >
                              👍 {comment.likes}
                            </button>
                            <button
                              onClick={() => handleDislikeComment(comment.id)}
                              className="text-red-500 hover:underline"
                            >
                              👎 {comment.dislikes}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <button
                        onClick={() =>
                          handleEditComment(comment.id, comment.text)
                        }
                        className="text-blue-500 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-red-500 hover:underline ml-2"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => handleReplyToComment(comment.id)}
                        className="text-gray-500 hover:underline ml-2"
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                  {replyCommentId === comment.id && (
                    <div className="mt-2 ml-4">
                      <input
                        type="text"
                        value={newReply}
                        onChange={(e) => setNewReply(e.target.value)}
                        placeholder="Add a reply..."
                        className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => handleAddReply(comment.id)}
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                      >
                        Submit
                      </button>
                    </div>
                  )}
                  {comment.replies.length > 0 && (
                    <ul className="mt-2 ml-4 space-y-2">
                      {comment.replies.map((reply) => (
                        <li key={reply.id} className="border-b py-2">
                          <p>{reply.text}</p>
                          <div className="flex items-center mt-2">
                            <button
                              onClick={() => handleLikeComment(reply.id)}
                              className="text-blue-500 hover:underline mr-2"
                            >
                              👍 {reply.likes}
                            </button>
                            <button
                              onClick={() => handleDislikeComment(reply.id)}
                              className="text-red-500 hover:underline"
                            >
                              👎 {reply.dislikes}
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>

            <div className="mt-4">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleAddComment}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
