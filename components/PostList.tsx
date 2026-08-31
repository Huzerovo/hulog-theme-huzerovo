import type { Page } from "@hulog/core";
import PostCard from "./PostCard";

/** 文章列表（卡片集合） */
export default function PostList({ posts }: { posts?: Page[] }) {
  if (!posts || posts.length === 0) return null;
  return (
    <div class="post-list">
      {posts.map((p) => (
        <PostCard key={p.id} post={p} />
      ))}
    </div>
  );
}
