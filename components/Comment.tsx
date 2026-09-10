import { useContext } from "preact/hooks";
import type { Page } from "@hulog/core";
import { ThemeContext } from "../lib/context";
import { GitalkConfig, themeConfigOf } from "../lib/types";

/**
 * 评论：Gitalk（结构兼容 huzerovo）。
 * 文章 front-matter gitalk: true 且主题启用时渲染。
 */
export default function Comment({ page }: { page: Page; }) {
  const { t, api } = useContext(ThemeContext);
  const tc = themeConfigOf(api);

  if (!tc.gitalk?.enable || !page.data.gitalk || !page.title) {
    return (
      <div class="comment-disabled">
        <p>{t("comment_disabled")}</p>
      </div>
    );
  }

  const conf: GitalkConfig = tc.gitalk.config!;
  conf.number = -1;
  conf.title = page.title;
  conf.id = page.title;
  if (typeof page.data.issue_id === "number") {
    conf.number = page.data.issue_id;
  }
  const script = `let c = ${JSON.stringify(conf)}; let gitalk = new Gitalk(c); gitalk.render("gitalk-container");`;

  return (
    <div class="comment">
      <div id="gitalk-container"></div>
      <link rel="stylesheet" href={tc.gitalk.source?.css} />
      <script src={tc.gitalk.source?.js}></script>
      <script src={tc.gitalk.source?.md5js}></script>
      <script dangerouslySetInnerHTML={{ __html: script }} />
    </div>
  );
}
