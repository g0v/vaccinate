// @flow
import * as React from 'react';

export type Hospital = {|
    hospitalId: Number,
    name: string,
    location: string,
    department: string,
    phone: string,
    address: string,
    website: string,
    availability: string,
|};

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

export default function Row(props: {
    hospitalId: Number,
    name: string,
    location: string,
    department: string,
    phone: string,
    address: string,
    website: string,
    availability: string,
}): React.Node {
  const {
    hospitalId, name, location, department, phone, address, website, availability,
  } = props;
  return (
    <tr>
      <td>{hospitalId.toString()}</td>
      <td>{name}</td>
      <td>{location}</td>
      <td>{department}</td>
      <td>{phone}</td>
      <td>{address}</td>
      <td><span className={getBadgeClassname(availability)}>{availability}</span></td>
      <td><a href={website}>Register here</a></td>
    </tr>
  );
}
