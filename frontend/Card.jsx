// @flow
import * as React from 'react';

function getBadgeClassname(availability: string): string {
  switch (availability) {
    case 'Available':
      return 'badge bg-success';
    case 'Unavailable':
      return 'badge bg-danger';
    default:
      return 'badge bg-light text-dark';
  }
}

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
        <p className="card-text">
          <span className={getBadgeClassname(availability)}>
            {availability}
          </span>
          <span className="badge bg-light text-dark">
            {location}
          </span>
        </p>
        <h4 className="card-title">{name}</h4>
        <h6 className="card-subtitle mb-2 text-muted">{address}</h6>
        <p className="card-text">{department}</p>
        <p className="card-text">{phone}</p>
        <a href={website} className="btn btn-primary">Get Appointment</a>
        <p className="card-text">
          <small className="text-muted">Last updated 1 mins ago</small>
        </p>
      </div>
    </div>
  );
}
