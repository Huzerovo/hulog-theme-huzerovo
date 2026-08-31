/** 文章目录（按标题层级缩进） */
export default function TOC({
  toc,
}: {
  toc: { level: number; id: string; text: string }[];
}) {
  if (toc.length === 0) return null;
  return (
    <ul class="toc-list">
      {toc.map((item) => (
        <li key={item.id} class={`toc-item toc-level-${item.level}`}>
          <a href={`#${item.id}`}>{item.text}</a>
        </li>
      ))}
    </ul>
  );
}
