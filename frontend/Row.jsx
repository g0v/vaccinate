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
      <td><a href={website}>Register here</a></td>
      <td>{availability}</td>
    </tr>
  );
}
