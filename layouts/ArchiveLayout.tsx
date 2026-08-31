import type { LayoutProps, Page } from "@hulog/core";
import { ARCHIVES_BASE } from "@hulog/core";
import Layout from "../components/Layout";
import Pager from "../components/Pager";
import { makeT } from "../lib/i18n";
import { formatDate } from "../lib/utils";

/**
 * 归档布局：
 * - 全部归档：page.data.posts（所有文章）+ page.data.years
 * - 单年归档：page.data.year 存在，仅展示该年文章
 */
export default function ArchiveLayout(props: LayoutProps) {
  const { page, config } = props;
  const t = makeT(config.language);
  const posts = (page.data.posts ?? []) as Page[];
  const year = page.data.year as number | undefined;
  const pagination = page.data.pagination as any;
  const archivesDir = (props.config.archivesDir ?? ARCHIVES_BASE).replace(
    /^\/+|\/+$/g,
    "",
  );

  const byYear = new Map<number, Page[]>();
  for (const p of posts) {
    if (!p.date) continue;
    const y = p.date.getFullYear();
    if (!byYear.has(y)) byYear.set(y, []);
    byYear.get(y)!.push(p);
  }
  const yearList = [...byYear.keys()].sort((a, b) => b - a);

  return (
    <Layout {...props} active="archives">
      <main class="container">
        <header class="page-head">
          <h1 class="page-title">{t("archives")}</h1>
        </header>
        <Pager pagination={pagination} />
        <div class="page-archive">
          {yearList.map((y) => (
            <section class="archive-year" key={y}>
              {year ? (
                <h2 class="archive-year-title">{y}</h2>
              ) : (
                <a class="archive-year-title" href={`/${archivesDir}/${y}`}>
                  {y}
                </a>
              )}
              <ul class="archive-list">
                {byYear
                  .get(y)!
                  .filter((p) =>
                    year ? p.date!.getFullYear() === year : true,
                  )
                  .map((p) => {
                    const postLink =
                      p.link && p.link !== "" ? p.link : p.url;
                    return (
                      <li class="archive-item" key={p.id}>
                        <time class="archive-item-date">
                          {formatDate(p.date, "MM-DD")}
                        </time>
                        <a class="archive-item-link" href={postLink}>
                          {p.title && p.title !== "" ? p.title : t("untitled")}
                        </a>
                      </li>
                    );
                  })}
              </ul>
            </section>
          ))}
          {yearList.length === 0 ? <p class="archive-empty">暂无文章</p> : null}
        </div>
        <Pager pagination={pagination} />
      </main>
    </Layout>
  );
}
