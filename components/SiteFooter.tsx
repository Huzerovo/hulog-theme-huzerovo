import { useContext } from "preact/hooks";
import { ThemeContext } from "../lib/context";
import { themeConfigOf } from "../lib/types";
import { formatDate, getCC } from "../lib/utils";

/** 页脚：版权 / 邮箱 / CC 协议 / Powered by */
export default function SiteFooter() {
  const { config, api } = useContext(ThemeContext);
  const tc = themeConfigOf(api);

  return (
    <footer id="site-footer">
      <p>
        © {formatDate(new Date(), "YYYY")}
        {tc.email ? (
          <a href={`mailto:${tc.email}`}>@{config.author}</a>
        ) : (
          <>@{config.author}</>
        )}
      </p>
      {getCC(tc) ? (
        <p>
          <span dangerouslySetInnerHTML={{ __html: getCC(tc) }} />
        </p>
      ) : null}
      <p>Powered by Huzerovo Blog.</p>
    </footer>
  );
}
