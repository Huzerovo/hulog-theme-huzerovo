import type { CategoryNode, CategoryPath, HelperRegistry, Page } from "@hulog/core";
import type { DefaultThemeConfig } from "./types";

/** 去掉 HTML 标签 */
export function stripHtml(html: string): string {
  return String(html ?? "")
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

/** 截断字符串 */
export function truncate(str: string, length: number, omission = "..."): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + omission;
}

/** 日期格式化 */
export function formatDate(
  d: Date | string | undefined,
  fmt = "YYYY-MM-DD",
): string {
  if (!d) return "";
  const date = d instanceof Date ? d : new Date(d);
  if (isNaN(date.getTime())) return "";
  return fmt
    .replaceAll("YYYY", String(date.getFullYear()))
    .replaceAll("MM", String(date.getMonth() + 1).padStart(2, "0"))
    .replaceAll("DD", String(date.getDate()).padStart(2, "0"))
    .replaceAll("HH", String(date.getHours()).padStart(2, "0"))
    .replaceAll("mm", String(date.getMinutes()).padStart(2, "0"))
    .replaceAll("SS", String(date.getSeconds()).padStart(2, "0"));
}

/**
 * 解析引用为可展示 URL（相对/绝对/外链）：
 * - http(s)://、// 或 / 开头 → 原样
 * - 相对路径 → 文章 URL + 相对名（文章专属目录，与页面同目录输出）
 */
export function getURL(ref: string, page: Page): string {
  if (/^(https?:)?\/\//.test(ref) || ref.startsWith("/")) return ref;
  return page.url + ref;
}

/** 置顶排序：front-matter pin 优先 */
export function getPostsSortWithPin(posts: Page[]): Page[] {
  const pin = posts.filter((p) => p.data.pin);
  const others = posts.filter((p) => !p.data.pin);
  return [...pin, ...others];
}

/** 未分类文章 */
export function getUncategorizedPosts(posts: Page[]): Page[] {
  return posts.filter((p) => p.categories?.length === 0);
}

/** 由文章列表构建分类树（含祖先节点与计数） */
export function getCategoryTree(
  posts: Page[],
  helper: HelperRegistry,
): CategoryNode[] {
  const paths: CategoryPath[] = [];
  for (const p of posts) paths.push(...p.categories!);
  return helper.get("buildCategoryTree")!(paths) as CategoryNode[];
}

/** 在分类树中按完整路径查找节点（找不到返回 undefined） */
export function findCategoryNode(
  nodes: CategoryNode[],
  path: CategoryPath,
): CategoryNode | undefined {
  let level = nodes;
  let found: CategoryNode | undefined;
  for (const seg of path) {
    found = level.find((n) => n.name === seg);
    if (!found) return undefined;
    level = found.children;
  }
  return found;
}

/** 分类面包屑：路径每一段 → { 名, 链接 }（最后一段为当前页，链接为空串） */
export function categoryBreadcrumb(
  path: CategoryPath,
  helper: HelperRegistry,
): {
  name: string;
  url: string;
}[] {
  const categoryPathToUrl = helper.get("categoryPathToUrl") as (
    path: CategoryPath,
  ) => string;
  return path.map((seg, i) => ({
    name: seg,
    url: i < path.length - 1 ? categoryPathToUrl(path.slice(0, i + 1)) : "",
  }));
}

/** 页面是否存在（menu 高亮判断） */
export function hasPage(site: { pages: Page[]; }, title: string): boolean {
  return site.pages.some((p) => p.title === title);
}

/** 页面标题 */
export function getPageTitle(
  title: string,
  tc: DefaultThemeConfig,
  t: (k: string) => string,
): string {
  if (tc.menu && title in tc.menu) return tc.menu[title]!.title;
  switch (title) {
    case "search":
    case "uncategorized":
      return t(title);
    default:
      return title.toUpperCase();
  }
}

/** <title> 内容 */
export function titleTag(
  page: Page,
  config: { siteTitle: string; subtitle?: string; description?: string; },
): string {
  let tail = "";
  if (config.subtitle) tail += " - " + config.subtitle;
  if (config.description) tail += " | " + config.description;
  const isPost = page.collection === "posts" || page.layout === "post";
  return isPost ? page.title + tail : config.siteTitle + tail;
}

/** 知识共享说明 HTML 片段 */
export function getCC(tc: DefaultThemeConfig): string {
  const cc = tc.creativecommons;
  if (!cc || !cc.link || !cc.license || !cc.description) return "";
  const link = `<a href="${cc.link}">${cc.license}</a>`;
  return cc.description.replaceAll("#", link);
}

/** 标签云：统计标签数量，字体大小映射（min 14 - max 30） */
export function tagcloud(
  tags: Map<string, number>,
): { tag: string; count: number; size: number; }[] {
  const counts = [...tags.entries()];
  if (counts.length === 0) return [];
  const max = Math.max(...counts.map(([, c]) => c));
  const min = Math.min(...counts.map(([, c]) => c));
  const span = max - min || 1;
  return counts.map(([tag, count]) => ({
    tag,
    count,
    size: 14 + Math.round(((count - min) / span) * (30 - 14)),
  }));
}
