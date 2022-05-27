import React, { Children } from 'react';

interface MasonryContainerProps {
  children: any;
  className: string;
  columnCount: number;
  columnGap: any;
}

export default function MasonryContainer({
  children,
  className,
  columnCount,
  columnGap
}: MasonryContainerProps) {
  const re_arranged_elements: any = [];
  const style = {
    columns: columnCount,
    columnGap: columnGap,
  }

  const child_style = {
    width: '100%',
    marginTop: columnGap
  }

  Children.toArray(children).forEach((child: any, index: number, all_children: any[]) => {
    for (let i = index; i < all_children.length; i += columnCount) {
      if (re_arranged_elements.indexOf(all_children[i], 0) === -1) {
        re_arranged_elements.push(all_children[i]);
      }
    }
  });

  const styled_children = React.Children.map(re_arranged_elements, (child: any) => {  
    return React.cloneElement(child, {
      style: child_style,
      masonrystyle: child_style
    });
  });  

  return (
    <div
      style={style}
      className={className + ' masonry-container'}
    >
      {styled_children}
    </div>
  );
}
