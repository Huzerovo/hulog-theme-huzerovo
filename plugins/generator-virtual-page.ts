import type { GeneratorAPI, Page, PageBase } from "@hulog/core";

type FunVirtualPage = (page: PageBase) => Page;

export default function (api: GeneratorAPI) {
  const virtualPage = api.helper.get("virtualPage") as FunVirtualPage;
  api.generator.register("theme:vPageGenerate", () => {
    const searchPage = virtualPage({
      id: "search",
      url: "/search",
      title: "搜索",
      layout: "search",
    });
    const categoriesPage = virtualPage({
      id: "categories",
      url: "/categories",
      title: "分类",
      layout: "categories",
    });
    const tagcloudPage = virtualPage({
      id: "tagcloud",
      url: "/tagcloud",
      title: "标签云",
      layout: "tagcloud",
    });
    return [searchPage, categoriesPage, tagcloudPage];
  });
}
