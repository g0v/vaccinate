// @flow
import * as React from 'react';

export default function Card(): React.Node {
  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Hospital Name</h5>
        <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card&apos;s content.</p>
        <a href="/" className="btn btn-primary">Go somewhere</a>
        <p className="card-text">
          <small className="text-muted">Last updated 3 mins ago</small>
        </p>
      </div>
    </div>
  );
}
