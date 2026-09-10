import type { PluginAPI } from "@hulog/core";

/** 主题配置（来自 api.theme.config） */
export interface GitalkConfig {
  clientID: string,
  clientSecret: string,
  repo: string,
  ownlwe: string,
  admin: [string],
  distractionFreeMode: boolean,
  id?: string,
  title?: string,
  number: number,
};

export interface DefaultThemeConfig {
  /** 首页标题（顶栏品牌可不同名） */
  index?: string;
  /** 站点名（顶栏品牌，缺省用 config.siteTitle） */
  brand?: string;
  /** 菜单：key → 标题与链接（key 与页面 title 对应可高亮） */
  menu?: Record<string, { title: string; link: string; }>;
  /** 默认封面列表（文章 front-matter cover: true 时追加） */
  covers?: string[];
  /** 邮箱（页脚） */
  email?: string;
  /** 搜索配置 */
  search?: { enable?: boolean; link?: string; };
  /** 是否开启文章目录 */
  toc?: boolean;
  /** 目录位置："left"（默认，正文左侧）| "right"（正文右侧） */
  tocSide?: "left" | "right";
  /** 数学公式（构建时 rehype-katex 已渲染时仅注入 CSS） */
  katex?: { enable?: boolean; css?: string; js?: string[]; };
  /** 主题样式（明/暗两套，含 CSS 变量定义） */
  style?: { light?: string; dark?: string; };
  /** 评论（Gitalk，结构兼容 huzerovo） */
  gitalk?: {
    enable?: boolean;
    source?: { css?: string; js?: string; md5js?: string; };
    config?: GitalkConfig;
  };
  /** 原生灯箱（点击正文图片放大） */
  lightbox?: { enable?: boolean; };
  /** 社交外链（顶栏图标，key 为内置 SVG 图标名：github/x/mastodon/rss/email/telegram/link） */
  links?: Record<string, { title?: string; url?: string; }>;
  /** 知识共享协议（页脚） */
  creativecommons?: { license?: string; link?: string; description?: string; };
  /** 归档配置 */
  archives_page?: { enabled?: boolean; year_per_page?: number; };
  /** 头像（关于页） */
  avatar?: string;
}

export function themeConfigOf(api: PluginAPI): DefaultThemeConfig {
  return (api.theme?.config ?? {}) as DefaultThemeConfig;
}
