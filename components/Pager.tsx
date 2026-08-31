/** 分页数据（分页插件注入 page.data.pagination） */
export interface PaginationData {
  current: number;
  total: number;
  prev?: boolean;
  prevLink?: string;
  next?: boolean;
  nextLink?: string;
  base: string;
  format: string;
}

/**
 * 分页器：第 1 页 = base，第 N 页 = base + format + "/N/"
 */
export default function Pager({
  pagination,
}: {
  pagination?: PaginationData;
}) {
  if (!pagination || pagination.total <= 1) return null;
  const { current, total, prev, prevLink, next, nextLink, base, format } =
    pagination;

  const urlOf = (n: number) => {
    if (n === 1) return base;
    const b = base.endsWith("/") ? base : base + "/";
    return `${b}${format.replace(/\/+$/, "")}/${n}/`;
  };

  const items = [];
  for (let i = 1; i <= total; i++) {
    items.push(
      i === current ? (
        <span class="page-number current">{i}</span>
      ) : (
        <a class="page-number" href={urlOf(i)}>
          {i}
        </a>
      ),
    );
  }

  return (
    <nav class="pager" aria-label="pagination">
      {prev ? (
        <a class="extend prev" href={prevLink} aria-label="prev">
          ‹
        </a>
      ) : null}
      {items}
      {next ? (
        <a class="extend next" href={nextLink} aria-label="next">
          ›
        </a>
      ) : null}
    </nav>
  );
}
