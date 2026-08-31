import type { Theme, ThemeAPI } from "@hulog/core";
import { ARCHIVES_BASE } from "@hulog/core";
import PostLayout from "./layouts/PostLayout";
import PageLayout from "./layouts/PageLayout";
import HomeLayout from "./layouts/HomeLayout";
import ArchiveLayout from "./layouts/ArchiveLayout";
import CategoryLayout from "./layouts/CategoryLayout";
import TagLayout from "./layouts/TagLayout";

/**
 * default 主题 —— 站点默认主题
 *
 * 布局与配色继承 huzerovo 的信息架构（sticky 顶栏 / 内容区 / 页脚、
 * 文章固定目录、明暗双主题切换），视觉语言重新设计：
 * - 卡片式文章列表（圆角 + 阴影 + 强调色徽标）
 * - 顶栏半透明毛玻璃 + 品牌标识 + 菜单下划线高亮
 * - 纯原生 JS（主题切换 / 搜索 / 灯箱 / 回到顶部），无 jQuery / 图标库依赖
 * - 配色为 huzerovo 色系的再打磨（靛蓝主色 + 暖橙点缀，CSS 变量 --hulog-*）
 */
export default function (api: ThemeAPI): Theme {
  void api;
  return {
    name: "default",
    config: {
      index: "首页",
      menu: {
        home: { title: "首页", link: "/" },
        archives: { title: "归档", link: `/${ARCHIVES_BASE}` },
        categories: { title: "分类", link: "/categories" },
        tagcloud: { title: "标签云", link: "/tagcloud" },
        about: { title: "关于", link: "/about" },
      },
      covers: [],
      email: "",
      search: { enable: true, link: "/search" },
      toc: true,
      tocSide: "left",
      katex: {
        enable: true,
        css: "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css",
      },
      style: { light: "css/light.css", dark: "css/dark.css" },
      gitalk: { enable: false },
      lightbox: { enable: true },
      links: {},
      creativecommons: {
        license: "CC BY-NC-ND 4.0",
        link: "https://creativecommons.org/licenses/by-nc-nd/4.0/",
        description: "如无特殊说明，网站内容采用#授权",
      },
      archives_page: { enabled: true, year_per_page: 5 },
    },
    layouts: {
      post: PostLayout,
      page: PageLayout,
      index: HomeLayout,
      archives: ArchiveLayout,
      category: CategoryLayout,
      tag: TagLayout,
      default: PageLayout,
    },
    assetsDir: "assets",
    assetsMode: "merge",
  };
}
