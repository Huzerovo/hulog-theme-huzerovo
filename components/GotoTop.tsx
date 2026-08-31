import { useContext } from "preact/hooks";
import { ThemeContext } from "../lib/context";

/** 回到顶部按钮（右下角，滚动后显示） */
export default function GotoTop() {
  const { t } = useContext(ThemeContext);
  return (
    <button id="goto-top" type="button" title={t("goto_top")} aria-label={t("goto_top")}>
      <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="m18 15-6-6-6 6" />
      </svg>
    </button>
  );
}
