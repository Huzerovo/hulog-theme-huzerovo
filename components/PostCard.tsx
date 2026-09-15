import { useContext } from "preact/hooks";
import type { Page } from "@hulog/core";
import { ThemeContext } from "../lib/context";
import { themeConfigOf } from "../lib/types";
import {
  formatDate,
  getPostCovers,
  pickCoverUrl,
  stripHtml,
  truncate,
} from "../lib/utils";

/**
 * 文章卡片（default 主题首页/列表单元）：
 * 封面（可选）+ 标题 + 摘要 + 底部信息（日期 / 置顶 / 待办徽标）。
 */
export default function PostCard({ post }: { post: Page; }) {
  const { config, t, api } = useContext(ThemeContext);
  const tc = themeConfigOf(api);
  const covers = getPostCovers(post, tc);
  const postLink = post.link && post.link !== "" ? post.link : post.url;
  const cover =
    covers.length > 0 ? pickCoverUrl(covers, post.slug) : "";

  const excerpt = stripHtml(post.excerpt ?? "");
  const todoMsg = post.data.todo_msg as string ?? "todo_msg";
  const content =
    excerpt === ""
      ? truncate(stripHtml(post.content), 140, "...")
      : excerpt;

  return (
    <article class="post-card">
      {cover ? (
        <a class="post-card-cover" href={cover} target="_blank" rel="noopener noreferrer">
          <img loading="lazy" src={cover} alt="" />
        </a>
      ) : null}

      <div class="post-card-body">
        <h2 class="post-card-title">
          <a href={postLink}>
            {post.title && post.title !== "" ? post.title : t("untitled")}
          </a>
        </h2>

        <p class="post-card-excerpt">{content}</p>

        <div class="post-card-footer">
          <time class="post-card-date">
            {post.data.todo
              ? `${t("update_date")}: ${formatDate(post.updated)}`
              : `${t("publish_date")}: ${formatDate(post.date)}`}
          </time>
          <div class="post-card-badges">
            {post.draft ? (
              <span class="badge badge-draft">{t("draft")}</span>
            ) : null}
            {post.data.todo ? (
              <span class="badge badge-todo">{t(todoMsg)}</span>
            ) : null}
            {post.data.outdated ? (
              <span class="badge badge-outdated">{t("outdated")}</span>
            ) : null}
            {post.data.pin ? (
              <span class="badge badge-pin">{t("pin")}</span>
            ) : null}
            <a class="post-card-more" href={postLink}>
              {t("view_more")} →
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
