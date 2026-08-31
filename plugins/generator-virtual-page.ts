import { GeneratorAPI } from '@/plugins.js';
import { Page, PageBase } from '@/types';

type FunVirtualPage = (page: PageBase) => Page;
export default function(api: GeneratorAPI) {
  const virtualPage = api.plugins.helpers.get("virtualPage") as FunVirtualPage;
  api.plugins.generators.register("theme:vPageGenerate", () => {
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
