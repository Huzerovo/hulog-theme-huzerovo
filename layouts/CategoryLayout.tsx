import type { CategoryPath, HelperRegistry, LayoutProps, Site } from "@hulog/core";
import Layout from "../components/Layout";
import Pager from "../components/Pager";
import PostList from "../components/PostList";
import { makeT } from "../lib/i18n";
import {
  categoryBreadcrumb,
  findCategoryNode,
  getCategoryTree,
} from "../lib/utils";

/**
 * 分类文章列表（支持子分类）：
 * 标题为层级面包屑（每段可点击），存在子分类时展示子分类 chip。
 */
export default function CategoryLayout(props: LayoutProps) {
  const { page, api } = props;
  const t = makeT(api.site!.config.language);
  const helper = api.helper;
  const posts = (page.data.posts ?? []) as typeof page[];
  const pagination = page.data.pagination as any;
  const path = (page.data.categoryPath ?? []) as CategoryPath;
  const categoryPathToUrl = helper.get("categoryPathToUrl") as (
    path: CategoryPath,
  ) => string;
  const crumbs = categoryBreadcrumb(path, helper);
  const children = getChildCategories(api.site!, path, helper);

  return (
    <Layout {...props } active="categories">
      <main class="container">
        <header class="page-head">
          <h1 class="page-title">
            {t("categories")}:{" "}
            {crumbs.map((c, i) => (
              <span key={c.name}>
                {i > 0 ? (
                  <span class="category-breadcrumb-sep"> / </span>
                ) : null}
                {c.url ? (
                  <a href={c.url}>{c.name}</a>
                ) : (
                  <span class="category-breadcrumb-current">{c.name}</span>
                )}
              </span>
            ))}
          </h1>
        </header>
        {children.length > 0 ? (
          <div class="page-categories category-sub-chips">
            {children.map((child) => (
              <a
                class="category-chip"
                key={child.path.join("/")}
                href={categoryPathToUrl(child.path)}
              >
                {child.name}
                <span class="chip-count">{child.count}</span>
              </a>
            ))}
          </div>
        ) : null}
        <Pager pagination={pagination} />
        <PostList posts={posts} />
        <Pager pagination={pagination} />
      </main>
    </Layout>
  );
}

/** 当前分类的直接子分类列表（来自站点文章分类树） */
function getChildCategories(
  site: Site,
  path: CategoryPath,
  helper: HelperRegistry,
): { name: string; path: CategoryPath; count: number; }[] {
  const posts = site.collections.get("posts")?.getPages(true) ?? [];
  const tree = getCategoryTree(posts, helper);
  const node = findCategoryNode(tree, path);
  if (!node) return [];
  return node.children.map((c) => ({
    name: c.name,
    path: c.path,
    count: c.count,
  }));
}
