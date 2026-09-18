import type { LayoutProps } from "@hulog/core";
import Layout from "../components/Layout";
import { getURL } from "../lib/utils";

/**
 * 图册索引布局（layout: gallery-index，虚拟页 /gallery/）：
 * 列出 gallery 集合的全部图册卡片——封面 = 每册首图（photos[0]）、标题、图片数量。
 * 点击卡片进入对应图册页（/gallery/:slug/）。
 */
export default function GalleryIndexLayout(props: LayoutProps) {
  const { page, api } = props;
  const galleries = api.site.collections.get("gallery")?.getPages() ?? [];

  return (
    <Layout {...props} active="gallery">
      <main class="container">
        <header class="page-head">
          <h1 class="page-title">{page.title}</h1>
        </header>

        {galleries.length > 0 ? (
          <div class="gallery-index">
            {galleries.map((g) => {
              const photos = (g.data.photos as string[] | undefined) ?? [];
              const cover = photos[0] ? getURL(String(photos[0]), g) : "";
              return (
                <a class="gallery-album" href={g.url} key={g.id}>
                  {cover ? (
                    <img loading="lazy" src={cover} alt="" />
                  ) : (
                    <span class="gallery-album-no-cover" />
                  )}
                  <span class="gallery-album-title">{g.title}</span>
                  <span class="gallery-album-meta">{photos.length} 张</span>
                </a>
              );
            })}
          </div>
        ) : (
          <p class="gallery-empty">
            暂无图册（在 content/gallery/ 下添加 Markdown 文件）
          </p>
        )}
      </main>
    </Layout>
  );
}