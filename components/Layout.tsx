import type { ComponentChildren } from "preact";
import type { LayoutProps } from "@hulog/core";
import { ThemeContext } from "../lib/context";
import { makeT } from "../lib/i18n";
import { themeConfigOf } from "../lib/types";
import { titleTag } from "../lib/utils";
import Topbar from "./Topbar";
import GotoTop from "./GotoTop";
import SiteFooter from "./SiteFooter";

/** 首屏前应用明暗主题（避免闪烁）：dark | light | auto（跟随系统） */
const THEME_INIT_SCRIPT = `(function(){try{var k=localStorage.getItem("df-theme-prefer");var d=k==="dark"||(k!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);var r=document.documentElement;if(d)r.classList.add("dark");r.dataset.theme=d?"dark":"light";r.style.colorScheme=d?"dark":"light";}catch(e){}})();`;

/**
 * 基础布局：HTML 骨架 + 主题资源/第三方库注入 + 首屏主题脚本。
 * 交互逻辑（主题切换/搜索/目录折叠/回到顶部/灯箱）见 assets/js/theme.js。
 * 不依赖 jQuery / Bootstrap Icons：图标为内联 SVG。
 */
export default function Layout({
  page,
  api,
  children,
  active,
}: LayoutProps & { children?: ComponentChildren; active?: string; }) {
  const config = api.site!.config;
  const tc = themeConfigOf(api);
  const t = makeT(config.language);
  const themeAsset = api.helper.get("themeAsset") as (p: string) => string;
  const katexCss = config.markdown?.katex !== false && tc.katex?.enable;
  // Mermaid：仅当本页含 .mermaid 容器时按需加载客户端渲染脚本
  const mermaidEnabled =
    config.markdown?.mermaid !== false && tc.mermaid?.enable !== false;
  const mermaidJs =
    tc.mermaid?.js ??
    "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs";
  const mermaidTheme = tc.mermaid?.theme ?? "default";
  const hasMermaid = mermaidEnabled && page.content.includes('class="mermaid"');

  return (
    <ThemeContext.Provider value={{ config, t, api }}>
      <html lang={config.language ?? "zh-CN"}>
        <head>
          <meta charset="UTF-8" />
          <meta name="author" content={config.author ?? ""} />
          <meta name="description" content={config.description ?? ""} />
          <meta
            name="theme-color"
            media="(prefers-color-scheme: light)"
            content="#f7f7f5"
          />
          <meta
            name="theme-color"
            media="(prefers-color-scheme: dark)"
            content="#141416"
          />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          {tc.favicon ? <link rel="icon" href={tc.favicon} /> : null}
          {tc.appleTouchIcon ? (
            <link rel="apple-touch-icon" href={tc.appleTouchIcon} />
          ) : null}
          <title>{titleTag(page, config)}</title>

          {katexCss ? <link rel="stylesheet" href={tc.katex!.css} /> : null}

          {tc.style?.light ? (
            <link rel="stylesheet" href={themeAsset(tc.style.light)} />
          ) : null}
          {tc.style?.dark ? (
            <link rel="stylesheet" href={themeAsset(tc.style.dark)} />
          ) : null}
          <link rel="stylesheet" href={themeAsset("css/main.css")} />

          {config.markdown?.katex === false && tc.katex?.enable ? (
            <>
              {tc.katex.js?.map((js) => (
                <script key={js} src={js}></script>
              ))}
              <script
                dangerouslySetInnerHTML={{
                  __html: `document.addEventListener("DOMContentLoaded", function() {
  renderMathInElement(document.body, {
    delimiters: [
      {left: '$$', right: '$$', display: true},
      {left: '$', right: '$', display: false},
      {left: '\\\\(', right: '\\\\)', display: false},
      {left: '\\\\[', right: '\\\\]', display: true}
    ],
    throwOnError: false
  });
});`,
                }}
              />
            </>
          ) : null}

          <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        </head>
        <body>
          <Topbar active={active} />
          {children}
          <GotoTop />
          <SiteFooter />
          {tc.lightbox?.enable !== false ? (
            <div id="lightbox">
              <img alt="" />
            </div>
          ) : null}
          <script src={themeAsset("js/search.js")}></script>
          {hasMermaid ? (
            <script
              type="module"
              src={themeAsset("js/mermaid.js")}
              data-hulog-mermaid=""
              data-src={mermaidJs}
              data-theme={mermaidTheme}
            />
          ) : null}
          <script src={themeAsset("js/theme.js")}></script>
        </body>
      </html>
    </ThemeContext.Provider>
  );
}
