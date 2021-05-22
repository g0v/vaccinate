// @flow
import * as React from 'react';

export default function AccordionItem(
  props: {id: string, title: string, parentID: string},
): React.Node {
  const { id, title, parentID } = props;
  return (
    <div className="accordion-item">
      <h2 className="accordion-header" id="headingOne">
        <button
          className="accordion-button collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target={`#${id}`}
          aria-expanded="true"
          aria-controls="collapseOne"
        >
          {title}
        </button>
      </h2>
      <div
        id={id}
        className="accordion-collapse collapse"
        aria-labelledby="headingOne"
        data-bs-parent={parentID}
      >
        <div className="accordion-body" />
      </div>
    </div>
  );
}
