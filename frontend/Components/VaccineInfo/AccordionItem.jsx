// @flow
import * as React from 'react';

export default function AccordionItem(
  props: {|
    id: string,
    title: string,
    parentID?: string,
    children: React.Node,
    collapsedByDefault?: boolean,
    setExpandedIndex?: number => void|},
): React.Node {
  const {
    id,
    title,
    parentID,
    children,
    collapsedByDefault,
    setExpandedIndex,
  } = props;
  const accordianButtonClassnames = collapsedByDefault ? 'accordion-button collapsed' : 'accordion-button';
  const accordionCollapseClassnames = collapsedByDefault ? 'accordion-collapse collapse' : 'accordion-collapse';
  return (
    <div className="accordion-item">
      <h2 className="accordion-header" id="headingOne">
        <button
          className={accordianButtonClassnames}
          type="button"
          data-bs-toggle="collapse"
          data-bs-target={`#${id}`}
          aria-expanded="true"
          aria-controls="collapseOne"
          onClick={setExpandedIndex}
        >
          {title}
        </button>
      </h2>
      <div
        id={id}
        className={accordionCollapseClassnames}
        aria-labelledby="headingOne"
        data-bs-parent={`#${parentID ?? ''}`}
      >
        <div className="accordion-body">
          {children}
        </div>
      </div>
    </div>
  );
}

AccordionItem.defaultProps = {
  collapsedByDefault: true,
  parentID: '',
  setExpandedIndex: () => {},
};
