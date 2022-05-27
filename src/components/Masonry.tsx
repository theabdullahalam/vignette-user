import React, { Children, useEffect, useLayoutEffect, useState } from 'react';

interface MasonryContainerProps {
  children: any;
  className: string;
  columnCounts: any;
  columnGap: any;
}

function useWindowSize() {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
}

export default function MasonryContainer({
  children,
  className,
  columnCounts,
  columnGap
}: MasonryContainerProps) {
  const [styled_children, setStyled_children] = useState<any[]>([]);
  const [re_arranged_elements, setRe_arranged_elements] = useState<any[]>([]);
  const [masonry_style, setMasonryStyle] = useState<any>({
    columns: columnCounts['default'] | 3,
    columnGap: columnGap
  });

  const [child_style, setChild_style] = useState<any>({
    width: '100%',
    marginTop: columnGap
  });

  const [width, height] = useWindowSize();
  const [numColumns, setNumColumn] = useState(1);

  const rearrange_children = () => {
    const _new_list: any[] = [];

    Children.toArray(children).forEach((child: any, index: number, all_children: any[]) => {
      for (let i = index; i < all_children.length; i += masonry_style.columns) {
        if (_new_list.indexOf(all_children[i], 0) === -1) {
          _new_list.push(all_children[i]);
        }
      }
    });

    setRe_arranged_elements(_new_list);
  };

  const style_children = () => {
    setStyled_children(
      React.Children.map(re_arranged_elements, (child: any) => {
        return React.cloneElement(child, {
          style: child_style,
          masonry_item_style: child_style
        });
      })
    );
  };

  useEffect(() => {
    rearrange_children();
  }, [children]);

  useEffect(() => {
    style_children();
  }, [re_arranged_elements]);

  useEffect(() => {
    let updated = false;
    Object.keys(columnCounts).forEach((key: any, i: number, all_keys: any[]) => {
      if (!updated) {
        if (!isNaN(parseInt(key))) {
          let breakPoint = parseInt(key);
          let prevBreakPoint = i > 0 ? parseInt(all_keys[i - 1]) : 0;

          if (width > prevBreakPoint && width < breakPoint) {
            setMasonryStyle({
              ...masonry_style,
              columns: columnCounts[key]
            });
            updated = true;
          }
        } else {
          setMasonryStyle({
            ...masonry_style,
            columns: columnCounts['default'] | 3
          });
          updated = true;
        }
      }
    });
  }, [width]);

  return (
    <div style={masonry_style} className={className + ' masonry-container'}>
      {styled_children}
    </div>
  );
}
