/** 语言包 */
export const languages: Record<string, Record<string, string>> = {
  "zh-CN": {
    goto_top: "回到顶部",
    toc: "目录",
    archives: "归档",
    categories: "分类",
    uncategorized: "未分类",
    tags: "标签",
    untitled: "无标题",
    todo_msg: "等待完成",
    publish_date: "发布日期",
    update_date: "更新日期",
    share_post: "分享文章",
    switch_theme: "切换主题",
    search: "搜索",
    input_keywords: "输入关键字搜索，/regex/ 为正则…",
    comment_disabled: "评论已关闭",
    pin: "置顶",
    draft: "草稿",
    view_more: "阅读全文",
  },
  "en-US": {
    goto_top: "Go to top",
    toc: "Content",
    archives: "Archive",
    categories: "Categories",
    uncategorized: "Uncategorized",
    tags: "Tags",
    untitled: "Untitled",
    todo_msg: "TODO",
    publish_date: "Publish",
    update_date: "Last Update",
    share_post: "share this post",
    switch_theme: "Switch Theme",
    search: "Search",
    input_keywords: "Search keywords, /regex/ supported...",
    comment_disabled: "Comments are disabled",
    pin: "Pinned",
    draft: "Draft",
    view_more: "Read more",
  },
};

/** 生成 _p(key) 翻译函数 */
export function makeT(lang?: string): (key: string) => string {
  const dict = languages[lang ?? "zh-CN"] ?? languages["zh-CN"]!;
  return (key: string) => dict[key] ?? key;
}
