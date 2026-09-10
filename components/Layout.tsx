import type { ComponentChildren } from "preact";
import type { LayoutProps } from "@hulog/core";
import { ThemeContext } from "../lib/context";
import { makeT } from "../lib/i18n";
import { themeConfigOf } from "../lib/types";
import { titleTag } from "../lib/utils";
import Topbar from "./Topbar";
import GotoTop from "./GotoTop";
import SiteFooter from "./SiteFooter";

/**
 * 基础布局：HTML 骨架 + 主题资源/第三方库注入 + 原生 JS（主题切换等）。
 * 不依赖 jQuery / Bootstrap Icons：图标为内联 SVG，交互为原生脚本。
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
  const themeAsset = api.plugins.helpers.get("themeAsset") as (p: string) => string;
  const useCoreHighlight = config.markdown?.highlight !== false;
  const katexCss = config.markdown?.katex !== false && tc.katex?.enable;

  const themeScript = `
const ThemeSwitcher = (() => {
  const KEY = "df-theme-prefer";
  const root = () => document.documentElement;
  const isDark = () => root().classList.contains("dark");
  const apply = (mode) => {
    if (mode === "dark") root().classList.add("dark");
    else if (mode === "light") root().classList.remove("dark");
    else if (window.matchMedia("(prefers-color-scheme: dark)").matches) root().classList.add("dark");
    else root().classList.remove("dark");
    localStorage.setItem(KEY, mode);
  };
  const current = () => localStorage.getItem(KEY) || "auto";
  const toggle = () => {
    const dark = isDark();
    const devDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if ((!dark && devDark) || (dark && !devDark)) apply("auto");
    else if (dark) apply("light");
    else apply("dark");
  };
  return { init: () => apply(current()), toggle, follow: () => apply(current()) };
})();
ThemeSwitcher.init();
window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", ThemeSwitcher.follow);
`;

  const bottomScript = `
(function () {
  var btn = document.getElementById("btn-switch-theme");
  if (btn) btn.addEventListener("click", ThemeSwitcher.toggle);

  var searchInput = document.getElementById("search-input");
  if (searchInput && window.searchArticles) {
    searchInput.addEventListener("input", function () {
      window.searchArticles(this.value, "/search.json");
    });
  }

  var menu = document.querySelector(".topbar-menu ul");
  if (menu) {
    var updateMenuFade = function () {
      menu.classList.toggle("scrollable", menu.scrollWidth > menu.clientWidth + 1);
    };
    updateMenuFade();
    window.addEventListener("resize", updateMenuFade);
  }

  var toc = document.getElementById("article-toc");
  var tocBtn = document.querySelector(".toc-toggle");
  if (toc && tocBtn) {
    var applyToc = function (collapsed) {
      toc.classList.toggle("collapsed", collapsed);
      tocBtn.setAttribute("aria-expanded", String(!collapsed));
    };
    // 恢复上次折叠状态（localStorage）
    applyToc(localStorage.getItem("df-toc-collapsed") === "1");
    tocBtn.addEventListener("click", function () {
      var next = !toc.classList.contains("collapsed");
      applyToc(next);
      localStorage.setItem("df-toc-collapsed", next ? "1" : "0");
    });
  }

  var topBtn = document.getElementById("goto-top");
  if (topBtn) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 300) topBtn.classList.add("show");
      else topBtn.classList.remove("show");
    });
    topBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  ${tc.lightbox?.enable !== false ? `
  var lightbox = document.getElementById("lightbox");
  if (lightbox) {
    // 构建时已把正文图片包为 .img-link（无 JS 时点击新标签打开原图）
    // 首页卡片封面 .post-card-cover 同样：href 指向图片，JS 拦截后走灯箱
    document
      .querySelectorAll("a.img-link, .post-card-cover")
      .forEach(function (link) {
        link.addEventListener("click", function (e) {
          e.preventDefault();
          var inner = link.querySelector("img");
          var src = inner ? inner.src : link.href;
          lightbox.querySelector("img").src = src;
          lightbox.classList.add("open");
        });
      });
    // 仅点击遮罩背景关闭（点图片本身不关，避免冒泡闪关）
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) lightbox.classList.remove("open");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") lightbox.classList.remove("open");
    });
  }` : ""}
})();
`;

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
          <title>{titleTag(page, config)}</title>

          {tc.style?.light ? (
            <link rel="stylesheet" href={themeAsset(tc.style.light)} />
          ) : null}
          {tc.style?.dark ? (
            <link rel="stylesheet" href={themeAsset(tc.style.dark)} />
          ) : null}
          <link rel="stylesheet" href={themeAsset("css/main.css")} />

          {katexCss ? <link rel="stylesheet" href={tc.katex!.css} /> : null}
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

          <script dangerouslySetInnerHTML={{ __html: themeScript }} />
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
          <script dangerouslySetInnerHTML={{ __html: bottomScript }} />
        </body>
      </html>
    </ThemeContext.Provider>
  );
}
