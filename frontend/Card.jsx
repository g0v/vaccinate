// @flow
import * as React from 'react';

export default function Card(props: {
  name: string,
  location: string,
  department: string,
  phone: string,
  address: string,
  website: string,
  availability: string,
}): React.Node {
  const {
    name, location, department, phone, address, website, availability,
  } = props;
  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">{name}</h5>
        <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card&apos;s content.</p>
        <a href="/" className="btn btn-primary">Go somewhere</a>
        <p className="card-text">
          <small className="text-muted">Last updated 3 mins ago</small>
        </p>
      </div>
    </div>
  );
}
