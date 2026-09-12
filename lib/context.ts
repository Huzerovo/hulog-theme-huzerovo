import { createContext } from "preact";
import type { CoreAPI, SiteConfig } from "@hulog/core";

/** 主题上下文：config + 翻译函数 + 统一 api（Layout 根部提供） */
export interface ThemeCtx {
  config: SiteConfig;
  t: (key: string) => string;
  api: CoreAPI;
}

export const ThemeContext = createContext<ThemeCtx>({
  config: {} as SiteConfig,
  t: (k) => k,
  api: {} as CoreAPI,
});
