// @flow
import * as React from 'react';
import AccordionItem from './AccordionItem';

export default function Accordion(
  props: { id: string, children: React.Element<typeof AccordionItem>[] },
): React.Node {
  const { children, id } = props;
  return (
    <div className="accordion" id={id}>
      {children}
    </div>
  );
}
