import type { CategoryPath, LayoutProps } from "@hulog/core";
import Layout from "../components/Layout";
import TOC from "../components/TOC";
import Comment from "../components/Comment";
import { makeT } from "../lib/i18n";
import { themeConfigOf } from "../lib/types";
import { formatDate } from "../lib/utils";

/**
 * 构建时（SSR）把正文图片包装为链接（渐进增强）：
 * - 无 JS 时：点击图片在新标签打开原图（浏览器原生行为）
 * - 有 JS 时：灯箱脚本拦截 .img-link 点击，改为站内放大
 * 已是链接（[![alt](img)](url)）的图片不重复包装。
 */
function wrapImages(html: string): string {
  const out: string[] = [];
  let last = 0;
  const re = /<img([^>]*)>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    out.push(html.slice(last, m.index));
    const attrs = m[1] ?? "";
    // 已被用户显式链接包裹（<a ...><img ...>）则跳过
    const tail = html.slice(Math.max(0, m.index - 80), m.index);
    const alreadyLinked = /<a\b[^>]*>\s*$/.test(tail);
    if (alreadyLinked) {
      out.push(m[0]);
    } else {
      const src = /src="([^"]*)"/.exec(attrs)?.[1] ?? "";
      out.push(
        src
          ? `<a class="img-link" href="${src}" target="_blank" rel="noopener noreferrer">${m[0]}</a>`
          : m[0],
      );
    }
    last = m.index + m[0].length;
  }
  out.push(html.slice(last));
  return out.join("");
}

/**
 * 文章布局：正文 + 固定目录（桌面端左侧）+ 分类/标签 + 日期 + 评论。
 */
export default function PostLayout(props: LayoutProps) {
  const { page, api } = props;
  const config = api.site!.config;
  const tc = themeConfigOf(api);
  const t = makeT(config.language);
  const helper = api.plugins.helpers;
  const categoryPathToUrl = helper.get("categoryPathToUrl") as (
    path: CategoryPath,
  ) => string;
  const categoryPathToString = helper.get("categoryPathToString") as (
    path: CategoryPath,
  ) => string;
  const toc = (page.metadata.toc ?? []) as {
    level: number;
    id: string;
    text: string;
  }[];
  const showToc = tc.toc && page.data.toc !== false && toc.length > 0;
  // 目录位置：left（默认，正文左侧）| right（正文右侧）
  const tocRight = tc.tocSide === "right";
  const shareUrl = (config.url ?? "") + page.url;

  const tocAside = showToc ? (
    <aside id="article-toc">
      <button type="button" class="toc-toggle" aria-expanded="true">
        <span class="toc-title">{t("toc")}</span>
        <svg
          class="toc-arrow"
          viewBox="0 0 24 24"
          width="14"
          height="14"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      <div class="toc-body">
        <TOC toc={toc} />
      </div>
    </aside>
  ) : null;

  return (
    <Layout {...props}>
      <main class="container post-container">
        <div class={`post-main ${tocRight ? "toc-right" : "toc-left"}`}>
          {tocRight ? null : tocAside}
          <article class="article-container">
            <header class="article-head">
              <h1>
                {page.title && page.title !== "" ? page.title : t("untitled")}
              </h1>
              <div class="article-head-meta">
                <span>
                  {t("publish_date")}: {formatDate(page.date)}
                </span>
                {page.updated ? (
                  <span>
                    {t("update_date")}: {formatDate(page.updated)}
                  </span>
                ) : null}
              </div>
            </header>

            <div dangerouslySetInnerHTML={{ __html: wrapImages(page.content) }} />

            <footer class="article-foot">
              <div class="article-taxonomies">
                {page.categories.length > 0 ? (
                  <p class="article-cats">
                    {t("categories")}:{" "}
                    {page.categories.map((path, i) => (
                      <a
                        key={path.join("/")}
                        class="article-category"
                        href={categoryPathToUrl(path)}
                      >
                        {i > 0 ? " · " : ""}
                        {categoryPathToString(path)}
                      </a>
                    ))}
                  </p>
                ) : null}
                {page.tags.length > 0 ? (
                  <p class="article-tags">
                    {t("tags")}:{" "}
                    {page.tags.map((tag, i) => (
                      <a
                        key={tag}
                        class="article-tag"
                        href={`/tags/${encodeURIComponent(tag)}/`}
                      >
                        {i > 0 ? " · " : ""}
                        {tag}
                      </a>
                    ))}
                  </p>
                ) : null}
              </div>
              <p class="article-share">
                {t("share_post")}{" "}
                <a href={shareUrl}>{shareUrl}</a>
              </p>
            </footer>

            <Comment page={page} />
          </article>

          {tocRight ? tocAside : null}
        </div>
      </main>
    </Layout>
  );
}
