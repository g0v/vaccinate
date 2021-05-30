// @flow
import * as React from 'react';
import Content from './Content';
import Map from './Map';

export default function Home(): React.Node {
  return (
    <div className="row" style={{ marginTop: 50 }}>
      <div className="col">
        <Content />
      </div>
      <div className="col d-none d-md-block">
        <Map />
      </div>
    </div>
  );
}
