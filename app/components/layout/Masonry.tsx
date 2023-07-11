import React from "react";

export const Masonry = ({ children }: { children: React.ReactNode }) => {
  const gridRef = React.useRef<HTMLDivElement>(null);
  const itemsRef = React.useRef<HTMLDivElement[]>([]);

  function resizeMasonryItem(item: HTMLDivElement) {
    const grid = gridRef.current;
    if (!grid) return;

    const rowGap = parseInt(
      window.getComputedStyle(grid).getPropertyValue("grid-row-gap")
    );
    const rowHeight = parseInt(
      window.getComputedStyle(grid).getPropertyValue("grid-auto-rows")
    );

    const rowSpan = Math.ceil(
      (item.children[0].getBoundingClientRect().height + rowGap) /
        (rowHeight + rowGap)
    );

    item.style.gridRowEnd = "span " + rowSpan;
    item.style.height = rowSpan * 10 + "px";
  }

  function resizeAllMasonryItems() {
    itemsRef.current.forEach((item) => resizeMasonryItem(item));
  }

  React.useEffect(() => {
    resizeAllMasonryItems();
  });

  return (
    <div
      ref={gridRef}
      style={{
        display: "grid",
        width: "100%",
        gridGap: "40px",
        gridTemplateColumns: "repeat(auto-fill, minmax(400px,1fr))",
        gridAutoRows: 0,
      }}
    >
      {React.Children.map(children, (child) => {
        return (
          <div
            ref={(el) => {
              if (el && !itemsRef.current.includes(el)) {
                itemsRef.current.push(el);
              }
            }}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
};
