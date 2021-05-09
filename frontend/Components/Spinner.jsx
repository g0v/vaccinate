// @flow
import * as React from 'react';

export default function Spinner(): React.Node {
  return (
    <div
      className="container"
      style={{
        textAlign: 'center',
        paddingBottom: 10,
      }}
    >
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}
