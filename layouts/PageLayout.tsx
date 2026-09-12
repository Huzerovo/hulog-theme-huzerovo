import { useContext } from "preact/hooks";
import type { CategoryNode, CategoryPath, HelperRegistry, LayoutProps, Page, Site } from "@hulog/core";
import Layout from "../components/Layout";
import Pager from "../components/Pager";
import PostList from "../components/PostList";
import Comment from "../components/Comment";
import { ThemeContext } from "../lib/context";
import { makeT } from "../lib/i18n";
import { themeConfigOf } from "../lib/types";
import {
  getCategoryTree,
  getPageTitle,
  getUncategorizedPosts,
  hasPage,
  tagcloud,
} from "../lib/utils";

/**
 * 页面布局：按 page.title 分发子页面组件
 * （about / categories / search / tagcloud / uncategorized / default）
 */
export default function PageLayout(props: LayoutProps) {
  const { page, api } = props;
  const config = api.site!.config;
  const t = makeT(config.language);
  const tc = themeConfigOf(api);

  return (
    <Layout {...props} active={page.layout}>
      <main class="container">
        <header class="page-head">
          <h1 class="page-title">{getPageTitle(page.title, tc, t)}</h1>
        </header>
        <PageBody page={page} site={api.site!} />
      </main>
    </Layout>
  );
}

function PageBody({ page, site }: { page: Page; site: Site; }) {
  switch (page.id) {
    case "about":
      return <AboutPage page={page} />;
    case "categories":
      return <CategoriesPage site={site} />;
    case "search":
      return <SearchPage />;
    case "tagcloud":
      return <TagCloudPage site={site} />;
    case "uncategorized":
      return <UncategorizedPage site={site} />;
    default:
      return (
        <div class="article-container">
          <div dangerouslySetInnerHTML={{ __html: page.content }} />
        </div>
      );
  }
}

/** 关于页 */
function AboutPage({ page }: { page: Page; }) {
  const { api } = useContext(ThemeContext);
  const tc = themeConfigOf(api);
  const avatar = page.data.avatar ?? tc.avatar;
  const menuLink = tc.menu?.about?.link ?? "/about";
  return (
    <div class="page-about">
      {avatar ? (
        <div class="about-card">
          <img
            class="about-avatar"
            alt="avatar"
            src={menuLink + String(avatar)}
          />
          {page.excerpt ? (
            <div
              class="about-description"
              dangerouslySetInnerHTML={{ __html: page.excerpt }}
            />
          ) : null}
        </div>
      ) : null}
      <div class="article-container about-content">
        <div dangerouslySetInnerHTML={{ __html: page.content }} />
      </div>
      {page.data.gitalk ? <Comment page={page} /> : null}
    </div>
  );
}

/** 分类页：未分类入口 + 分类树（huzerovo 风格嵌套列表，父分类下显示子分类） */
function CategoriesPage({ site }: { site: Site; }) {
  const { config, t, api } = useContext(ThemeContext);
  const helper = api.helper;
  const posts = site.collections.get("posts")?.getPages(true) ?? [];
  const tree = getCategoryTree(posts, helper);
  const uncategorized = getUncategorizedPosts(posts);

  return (
    <div class="page-categories">
      {config.defaultCategory === "uncategorized" &&
        hasPage(site, config.defaultCategory) ? (
        <ul class="category-list">
          <li class="category-list-item">
            <a class="category-list-link" href="/uncategorized">
              {t("uncategorized")}
            </a>
            <span class="category-list-count">{uncategorized.length}</span>
          </li>
        </ul>
      ) : null}
      <CategoryTreeNodes nodes={tree} helper={helper} />
    </div>
  );
}

/** 分类树递归渲染：父分类下嵌套子分类列表 */
function CategoryTreeNodes({
  nodes,
  helper,
}: {
  nodes: CategoryNode[];
  helper: HelperRegistry;
}) {
  if (nodes.length === 0) return null;
  const categoryPathToUrl = helper.get("categoryPathToUrl") as (
    path: CategoryPath,
  ) => string;
  return (
    <ul class="category-list">
      {nodes.map((node) => (
        <li class="category-list-item" key={node.path.join("/")}>
          <a class="category-list-link" href={categoryPathToUrl(node.path)}>
            {node.name}
          </a>
          <span class="category-list-count">{node.count}</span>
          {node.children.length > 0 ? (
            <ul class="category-list-child">
              <CategoryTreeNodes nodes={node.children} helper={helper} />
            </ul>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

/** 搜索页 */
function SearchPage() {
  const { t } = useContext(ThemeContext);
  return (
    <div class="search-bar">
      <input
        id="search-input"
        type="search"
        placeholder={t("input_keywords")}
        autocomplete="off"
      />
      <div id="search-results" class="search-results"></div>
    </div>
  );
}

/** 标签云页 */
function TagCloudPage({ site }: { site: Site; }) {
  const posts = site.collections.get("posts")?.getPages(true) ?? [];
  const counts = new Map<string, number>();
  for (const p of posts) {
    for (const tag of p.tags ?? []) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  const cloud = tagcloud(counts);
  return (
    <div class="page-tagcloud">
      {cloud.map(({ tag, count, size }) => (
        <a
          key={tag}
          class="tagcloud"
          style={`font-size: ${size}px;`}
          href={`/tags/${encodeURIComponent(tag)}/`}
        >
          {tag} ({count})
        </a>
      ))}
    </div>
  );
}

/** 未分类页 */
function UncategorizedPage({ site }: { site: Site; }) {
  const posts = getUncategorizedPosts(
    site.collections.get("posts")?.getPages(true) ?? [],
  );
  return (
    <>
      <Pager pagination={undefined} />
      <PostList posts={posts} />
      <Pager pagination={undefined} />
    </>
  );
}
