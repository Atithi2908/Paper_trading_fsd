import React from "react";
import { FaRegCommentDots, FaRegHeart, FaArrowUp, FaArrowDown } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";

interface User {
  id: string;
  name: string;  avatarUrl?: string;
}

interface Post {
  id: string;
  content: string;
  createdAt: string;
  user: User;
  sentiment?: "buy" | "sell" | "neutral"; 
  tags?: string[];
  likesCount?: number;
  commentsCount?: number;
}

interface PostProps {
  post: Post;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
}

const sentimentColor = {
  buy: "text-green-400",
  sell: "text-red-400",
  neutral: "text-secondary",
};

const Post: React.FC<PostProps> = ({ post, onLike, onComment }) => {
  return (
    <div className="theme-card p-4 shadow-md mb-4 text-primary w-full max-w-xl hover:bg-panel-soft transition-all">
      
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-3">
        <img
          src={
            post.user.avatarUrl ||
            `https://ui-avatars.com/api/?name=${post.user.name}&background=random`
          }
          alt="avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <span className="font-semibold text-stone-100">
            {post.user.name}
          </span>
          <span className="text-sm text-secondary">
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </span>
        </div>
      </div>

      <div className="mb-3">
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {post.tags.map((tag, idx) => (
              <span
                key={idx}
                className="bg-panel-soft border border-contrast text-secondary text-xs px-2 py-1 rounded-full"
              >
                {tag.startsWith("$") || tag.startsWith("#") ? tag : `#${tag}`}
              </span>
            ))}
          </div>
        )}
        <p className="text-primary whitespace-pre-wrap break-words leading-relaxed">
          {post.content}
        </p>
      </div>

      {post.sentiment && (
        <div className="flex items-center gap-2 mt-2">
          {post.sentiment === "buy" && <FaArrowUp className="text-green-400" />}
          {post.sentiment === "sell" && <FaArrowDown className="text-red-400" />}
          <span className={`capitalize text-sm ${sentimentColor[post.sentiment]}`}>
            {post.sentiment} sentiment
          </span>
        </div>
      )}
      <div className="flex justify-between items-center text-secondary text-sm mt-4 border-t border-accent pt-2">
        <button
          onClick={() => onLike && onLike(post.id)}
          className="flex items-center gap-2 hover:text-red-400 transition"
        >
          <FaRegHeart /> {post.likesCount ?? 0}
        </button>

        <button
          onClick={() => onComment && onComment(post.id)}
          className="flex items-center gap-2 hover:text-sky-400 transition"
        >
          <FaRegCommentDots /> {post.commentsCount ?? 0}
        </button>
      </div>
    </div>
  );
};

export default Post;