import type { LayoutProps } from "@hulog/core";
import Layout from "../components/Layout";
import Pager from "../components/Pager";
import PostList from "../components/PostList";
import { themeConfigOf } from "../lib/types";

/**
 * 首页布局：page.data.posts（当前页文章）+ page.data.pagination
 */
export default function HomeLayout(props: LayoutProps) {
  const { page, api } = props;
  const tc = themeConfigOf(api);
  const posts = (page.data.posts ?? []) as typeof page[];
  const pagination = page.data.pagination as any;

  return (
    <Layout {...props} active="home">
      <main class="container">
        <header class="page-head">
          <h1 class="page-title">{tc.index ?? "首页"}</h1>
        </header>
        <Pager pagination={pagination} />
        <PostList posts={posts} />
        <Pager pagination={pagination} />
      </main>
    </Layout>
  );
}
