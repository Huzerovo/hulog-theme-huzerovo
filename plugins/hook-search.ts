import type { Asset, HookAPI, Page } from "@hulog/core";

/**
 * huzerovo 主题 · 搜索后端：构建时生成 /search.json（默认主题的前端搜索由
 * assets/js/search.js 消费：Layout 底部脚本在 #search-input 上绑定 input →
 * window.searchArticles → fetch /search.json）。
 *
 * 数据来源：beforeWrite 阶段的所有已渲染页面（过滤空正文），输出
 * title / url / 纯文本内容 / tags / 扁平化分类 / date。
 */
export default function (api: HookAPI) {
  api.hook.beforeWrite.tap("theme:searchJson", (pages: Page[], assets: Asset[]) => {
    const items: unknown[] = [];
    for (const p of pages) {
      // 虚拟列表页（首页/归档/标签等）正文为空，不进入索引
      if (!p.content || p.content.trim() === "") continue;
      items.push({
        title: p.title,
        url: p.url,
        content: stripHtml(p.content),
        tags: p.tags ?? [],
        categories: (p.categories ?? []).map((path) => path.join("/")),
        date: fmtDate(p.date),
      });
    }
    assets.push({
      sourcePath: "",
      url: "/search.json",
      buffer: Buffer.from(JSON.stringify(items)),
      type: "other",
      belongsTo: "global",
    });
  });
}

/** 去 HTML 标签与实体（与搜索引擎正文匹配/摘要展示用纯文本） */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

/** 本地时区 YYYY-MM-DD（与主题 utils.formatDate 一致） */
function fmtDate(d?: Date): string {
  if (!d || isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}