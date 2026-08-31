import type { LayoutProps, Page } from "@hulog/core";
import Layout from "../components/Layout";
import Pager from "../components/Pager";
import PostList from "../components/PostList";
import { makeT } from "../lib/i18n";

/** 标签文章列表 */
export default function TagLayout(props: LayoutProps) {
  const { page, config } = props;
  const t = makeT(config.language);
  const posts = (page.data.posts ?? []) as Page[];
  const pagination = page.data.pagination as any;

  return (
    <Layout {...props} active="tagcloud">
      <main class="container">
        <header class="page-head">
          <h1 class="page-title">
            {t("tags")}: {String(page.data.tag ?? "")}
          </h1>
        </header>
        <Pager pagination={pagination} />
        <PostList posts={posts} />
        <Pager pagination={pagination} />
      </main>
    </Layout>
  );
}
