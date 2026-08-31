import { useContext } from "preact/hooks";
import { ThemeContext } from "../lib/context";
import { themeConfigOf } from "../lib/types";

/**
 * 顶栏：品牌标识 + 菜单（当前项下划线高亮）+ 图标按钮（搜索 / 主题切换 / 社交外链）。
 * 图标为内联 SVG，无外部图标库依赖。
 */
export default function Topbar({ active }: { active?: string }) {
  const { config, t } = useContext(ThemeContext);
  const tc = themeConfigOf(config);
  const brand = tc.brand || config.siteTitle;

  return (
    <header id="topbar">
      <div class="topbar-container">
        <a class="topbar-brand" href="/">
          {brand}
        </a>

        <nav class="topbar-menu">
          <ul>
            {tc.menu
              ? Object.entries(tc.menu).map(([key, item]) => (
                  <li key={key}>
                    <a
                      class={key === active ? "active" : undefined}
                      href={item.link}
                    >
                      {item.title}
                    </a>
                  </li>
                ))
              : null}
          </ul>
        </nav>

        <div class="topbar-icons">
          {tc.links
            ? Object.entries(tc.links).map(([name, link]) => (
                <a
                  key={name}
                  class="icon-button"
                  title={link.title ?? name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon name={name} />
                </a>
              ))
            : null}

          {tc.search?.enable && tc.search.link ? (
            <a
              id="btn-search"
              class="icon-button"
              title={t("search")}
              href={tc.search.link}
            >
              <Icon name="search" />
            </a>
          ) : null}

          <button
            id="btn-switch-theme"
            class="icon-button icon-theme"
            type="button"
            title={t("switch_theme")}
          >
            <Icon name="sun" class="icon-sun" />
            <Icon name="moon" class="icon-moon" />
          </button>
        </div>
      </div>
    </header>
  );
}

/** 内置 SVG 图标集 */
const ICON_PATHS: Record<string, string> = {
  search:
    '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4m11.4-11.4 1.4-1.4"/>',
  moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
  github:
    '<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/>',
  x: '<path d="M4 4l7.2 9.6L4.4 20h2.3l5.5-5.2L16.8 20H20l-7.5-10L19.5 4h-2.3l-5 4.7L7.2 4H4z"/>',
  mastodon:
    '<path d="M21.3 12.5c0 5.5-2.4 6.9-4.8 7.6-1.2.3-3.6.6-5.2.6-1.7 0-4.2-.3-5.4-.6-2.4-.7-4.8-2.1-4.8-7.6 0-3.4.1-7.2 1.2-8.7 1-1.5 3-1.6 4.6-1.7l.3 2c0-.1.3-.2 2.6-.2 2.3 0 2.6.1 2.6.2l.3-2c1.6.1 3.6.2 4.6 1.7 1.1 1.5 1.2 5.3 1.2 8.7zM9.3 8.2c-.9 0-1.6.8-1.6 1.8s.7 1.8 1.6 1.8 1.6-.8 1.6-1.8-.7-1.8-1.6-1.8zm5.4 0c-.9 0-1.6.8-1.6 1.8s.7 1.8 1.6 1.8 1.6-.8 1.6-1.8-.7-1.8-1.6-1.8z"/>',
  rss: '<path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1.5"/>',
  email:
    '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
  telegram:
    '<path d="m22 3-9.5 9.5"/><path d="M22 3 15 21l-3.5-8.5L3 9l19-6z"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>',
};

function Icon({ name, class: cls }: { name: string; class?: string }) {
  const d = ICON_PATHS[name] ?? ICON_PATHS["link"]!;
  return (
    <svg
      class={cls}
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: d }}
    />
  );
}
