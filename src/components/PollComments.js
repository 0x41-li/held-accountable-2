"use client";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { auth } from "../../lib/firebase";
import Image from "next/image";
import { getUserById } from "@/services/polls/polls";

export default function PollComments({ pollId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [sortBy, setSortBy] = useState("most_recent");
  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(null);

  useEffect(() => {
    if (auth.currentUser) {
      getUserById(auth.currentUser.uid).then(setUser);
    }
  }, []);

  const loadComments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/company-polls/${pollId}/comments`);
      if (response.ok) {
        const data = await response.json();
        const allComments = data.comments || [];
        
        // Organize comments into parent-child structure
        const parentComments = allComments.filter(c => !c.parent_id);
        const replies = allComments.filter(c => c.parent_id);
        
        // Attach replies to their parents
        const organizedComments = parentComments.map(parent => {
          const commentReplies = replies.filter(r => r.parent_id === parent.id);
          return { ...parent, replies: commentReplies };
        });
        
        // Sort comments
        let sorted = [...organizedComments];
        if (sortBy === "most_recent") {
          sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        } else if (sortBy === "oldest") {
          sorted.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        }
        
        setComments(sorted);
      }
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pollId) {
      loadComments();
    }
  }, [pollId, sortBy]);

  const handleSubmitComment = async (content, parentId = null) => {
    if (!auth.currentUser || !content.trim()) {
      return;
    }

    try {
      const response = await fetch(`/api/company-polls/${pollId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: auth.currentUser.uid,
          user_name: user?.fullname || user?.username || auth.currentUser.displayName || 'User',
          user_logo: user?.avatar || auth.currentUser.photoURL || '',
          parent_id: parentId,
          content: content.trim()
        })
      });

      if (response.ok) {
        setNewComment("");
        setReplyContent("");
        setReplyingTo(null);
        loadComments();
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} Minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} Hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} Day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  const totalComments = comments.reduce((sum, comment) => sum + 1 + (comment.replies?.length || 0), 0);

  return (
    <div className="w-full mt-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h3 className="text-[24px] font-bold text-[#2B425B]">Comments</h3>
          <span className="bg-[#3B88E3] text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            {totalComments}
          </span>
        </div>
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="appearance-none bg-white border border-[#E4E7EC] rounded-lg px-3 py-2 pr-7 text-sm text-[#667085] cursor-pointer hover:border-[#3B88E3] transition-colors focus:outline-none focus:border-[#3B88E3]"
          >
            <option value="most_recent">Most Recent</option>
            <option value="oldest">Oldest</option>
          </select>
          <Icon 
            icon="mdi:chevron-up" 
            width={16} 
            height={16} 
            className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#667085]"
          />
        </div>
      </div>

      {/* Add Comment Input */}
      {auth.currentUser && (
        <div className="flex items-center gap-3 mb-8 p-3 bg-white rounded-xl border border-[#E4E7EC] card-item">
          <img
            src={user?.avatar || auth.currentUser.photoURL || "/images/logo.png"}
            alt="avatar"
            width={40}
            height={40}
            className="rounded-full object-cover border border-[#E4E7EC] flex-shrink-0"
          />
          <div className="flex-1 flex items-center gap-2 items-start">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmitComment(newComment);
                }
              }}
              placeholder="Add Comment..."
              className="flex-1 border-none outline-none text-sm text-[#2B425B] placeholder:text-[#98A2B3] bg-transparent"
            />
            <button
              onClick={() => handleSubmitComment(newComment)}
              disabled={!newComment.trim()}
              className="text-[#98A2B3] hover:text-[#667085] transition-colors p-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Icon icon="mdi:emoticon-happy-outline" width={20} height={20} />
            </button>
          </div>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="text-center py-8 text-[#667085]">Loading comments...</div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-[#667085]">No comments yet. Be the first to comment!</div>
      ) : (
        <div className="flex flex-col gap-6">
          {comments.map((comment) => (
            <div key={comment.id} className="flex flex-col gap-4">
              {/* Parent Comment */}
              <div className="flex gap-3 items-start">
                <img
                  src={comment.user_logo || "/images/logo.png"}
                  alt={comment.user_name || "User"}
                  width={40}
                  height={40}
                  className="rounded-full object-cover border border-[#E4E7EC] flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-[#2B425B]">
                        {comment.user_name || "Anonymous"}
                      </span>
                      <span className="text-xs text-[#98A2B3]">
                        {formatTimeAgo(comment.created_at)}
                      </span>
                    </div>
                    <div className="relative">
                      <button
                        onClick={() => setShowMenu(showMenu === comment.id ? null : comment.id)}
                        className="text-[#98A2B3] hover:text-[#667085] p-1 transition-colors"
                      >
                        <Icon icon="mdi:dots-horizontal" width={20} height={20} />
                      </button>
                      {showMenu === comment.id && (
                        <div className="absolute right-0 top-8 bg-white border border-[#E4E7EC] rounded-lg shadow-lg z-10 min-w-[160px] py-1">
                          <button
                            onClick={() => {
                              // TODO: Implement report functionality
                              setShowMenu(null);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-[#667085] hover:bg-[#F9FAFB] flex items-center gap-2 transition-colors"
                          >
                            <Icon icon="mdi:clock-outline" width={16} height={16} />
                            Report Comment
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-[#2B425B] leading-6 mb-2 whitespace-pre-wrap break-words">
                    {comment.content}
                  </p>
                  <button
                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                    className="text-xs text-[#3B88E3] hover:text-[#2B5FCC] font-medium transition-colors"
                  >
                    Reply
                  </button>
                  
                  {/* Reply Input */}
                  {replyingTo === comment.id && auth.currentUser && (
                    <div className="mt-3 flex items-center gap-2 card-item px-3">
                      <img
                        src={user?.avatar || auth.currentUser.photoURL || "/images/logo.png"}
                        alt="avatar"
                        width={32}
                        height={32}
                        className="rounded-full object-cover border border-[#E4E7EC] flex-shrink-0"
                      />
                      <div className="flex-1 flex items-center gap-2">
                        <input
                          type="text"
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSubmitComment(`@${comment.user_name} ${replyContent}`, comment.id);
                            }
                          }}
                          placeholder={`Reply to ${comment.user_name}...`}
                          className="flex-1 bg-transparent rounded-lg px-3 py-2 text-sm text-[#2B425B] placeholder:text-[#98A2B3] outline-none focus:border-[#3B88E3] transition-colors"
                        />
                        <button
                          onClick={() => handleSubmitComment(`@${comment.user_name} ${replyContent}`, comment.id)}
                          className="text-[#3B88E3] hover:text-[#2B5FCC] px-3 py-2 text-sm font-medium transition-colors"
                        >
                          Post
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="ml-12 flex flex-col gap-4 mt-2">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="flex gap-3 items-start">
                      <img
                        src={reply.user_logo || "/images/logo.png"}
                        alt={reply.user_name || "User"}
                        width={40}
                        height={40}
                        className="rounded-full object-cover border border-[#E4E7EC] flex-shrink-0"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-[#2B425B]">
                              {reply.user_name || "Anonymous"}
                            </span>
                            <span className="text-xs text-[#98A2B3]">
                              {formatTimeAgo(reply.created_at)}
                            </span>
                          </div>
                          <div className="relative">
                            <button
                              onClick={() => setShowMenu(showMenu === reply.id ? null : reply.id)}
                              className="text-[#98A2B3] hover:text-[#667085] p-1 transition-colors"
                            >
                              <Icon icon="mdi:dots-horizontal" width={20} height={20} />
                            </button>
                            {showMenu === reply.id && (
                              <div className="absolute right-0 top-8 bg-white border border-[#E4E7EC] rounded-lg shadow-lg z-10 min-w-[160px] py-1">
                                <button
                                  onClick={() => {
                                    // TODO: Implement report functionality
                                    setShowMenu(null);
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm text-[#667085] hover:bg-[#F9FAFB] flex items-center gap-2 transition-colors"
                                >
                                  <Icon icon="mdi:clock-outline" width={16} height={16} />
                                  Report Comment
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-[#2B425B] leading-6 mb-2 whitespace-pre-wrap break-words">
                          {reply.content}
                        </p>
                        <button
                          onClick={() => setReplyingTo(replyingTo === reply.id ? null : reply.id)}
                          className="text-xs text-[#3B88E3] hover:text-[#2B5FCC] font-medium transition-colors"
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

