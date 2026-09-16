import { useContext } from "preact/hooks";
import type { Page } from "@hulog/core";
import { ThemeContext } from "../lib/context";
import {
  formatDate,
  getURL,
  stripHtml,
  truncate,
} from "../lib/utils";

/**
 * 文章卡片（default 主题首页/列表单元）：
 * 封面（可选）+ 标题 + 摘要 + 底部信息（日期 / 置顶 / 待办徽标）。
 */
export default function PostCard({ post }: { post: Page; }) {
  const { t } = useContext(ThemeContext);
  const link = post.data.link as string | undefined;
  const postLink = link && link !== "" ? link : post.url;
  const cover = post.data.cover ? getURL(post.data.cover as string, post) : "";

  const excerpt = stripHtml((post.data.excerpt as string) ?? "");
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
