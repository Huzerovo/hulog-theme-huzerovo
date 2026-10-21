import type { LayoutProps } from "@hulog/core";
import Layout from "../components/Layout";
import { makeT } from "../lib/i18n";
import { themeConfigOf } from "../lib/types";
import { getURL } from "../lib/utils";

/**
 * 图册索引布局（layout: gallery-index，虚拟页 /gallery/）：
 * 列出图册集合的全部图册卡片——封面 = 每册首图（photos[0]）、标题、图片数量。
 * 集合名可用主题配置 gallery.collection 覆盖（默认 "gallery"）。
 */
export default function GalleryIndexLayout(props: LayoutProps) {
  const { page, api } = props;
  const tc = themeConfigOf(api);
  const t = makeT(api.site!.config.language);
  const collection = tc.gallery?.collection ?? "gallery";
  const galleries = api.site.collections.get(collection)?.getPages() ?? [];

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
                  <span class="gallery-album-meta">
                    {t("photo_count").replace("{n}", String(photos.length))}
                  </span>
                </a>
              );
            })}
          </div>
        ) : (
          <p class="gallery-empty">{t("gallery_index_empty")}</p>
        )}
      </main>
    </Layout>
  );
}