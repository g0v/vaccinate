// @flow
import * as React from 'react';
import AccordionItem from './AccordionItem';

export default function Accordion(
  props: { id: string, children: React.Element<typeof AccordionItem>[] },
): React.Node {
  const { children, id } = props;
  const [ expandedIndex, setExpandedIndex ] = React.useState(0);
  console.log("Rendering with expanded index: ", expandedIndex);
  const handleClick: (i: number) => void = i => {
    console.log("Handling click of ", i);
    i === expandedIndex ? setExpandedIndex(-1) : setExpandedIndex(i);
  }
  return (
    <div className="accordion" id={id}>
      {children.map((item, index) => React.cloneElement(
        item,
        {
          collapsedByDefault: expandedIndex !== index,
          parentID: id,
          setExpandedIndex: () => handleClick(index),
        },
      ))}
    </div>
  );
}
