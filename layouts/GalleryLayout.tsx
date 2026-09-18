import type { LayoutProps } from "@hulog/core";
import Layout from "../components/Layout";
import { themeConfigOf } from "../lib/types";
import { getURL } from "../lib/utils";

/**
 * 图册布局（front-matter `layout: gallery`）：
 * - 图片来自 front-matter `photos`（字符串数组），经 `getURL` 解析为展示 URL
 *   （相对路径 → 页面 URL + 相对名；`/`、`http(s)://` 原样）
 * - 响应式栅格：列数由主题配置 `gallery.columns` 控制（默认 3），移动端降为 2 列
 * - 点击图片走现有灯箱（无 JS 时回退为浏览器新标签打开原图）
 * - Markdown 正文渲染在图册上方，可写简介/说明
 */
export default function GalleryLayout(props: LayoutProps) {
  const { page, api } = props;
  const tc = themeConfigOf(api);
  const photos = (page.data.photos as string[] | undefined) ?? [];
  const columns = tc.gallery?.columns ?? 3;
  const useLightbox = tc.gallery?.lightbox !== false;

  return (
    <Layout {...props} active={page.layout}>
      <main class="container">
        <header class="page-head">
          <h1 class="page-title">{page.title}</h1>
        </header>

        {page.content ? (
          <div
            class="article-container gallery-intro"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        ) : null}

        {photos.length > 0 ? (
          <div
            class="gallery-grid"
            style={{ "--gallery-cols": String(columns) } as any}
          >
            {photos.map((p, i) => {
              const url = getURL(String(p), page);
              return (
                <a
                  key={i}
                  class={useLightbox ? "gallery-item" : "gallery-link"}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img loading="lazy" src={url} alt="" />
                </a>
              );
            })}
          </div>
        ) : (
          <p class="gallery-empty">
            暂无图片（在 front-matter 中通过 photos 字段提供）
          </p>
        )}
      </main>
    </Layout>
  );
}