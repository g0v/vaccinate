// @flow
import * as React from 'react';
import Row from './Row';

import type { Hospital } from './Row';

export default function Table(props: { rows: Array<Hospital> }): React.Node {
  const { rows } = props;
  return (
    <div>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Hospital Name</th>
            <th>Location</th>
            <th>Department</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Availability</th>
            <th>Website</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((rowData) => (
            <Row
              key={rowData.hospitalId.toString()}
              hospitalId={rowData.hospitalId}
              name={rowData.name}
              location={rowData.location}
              department={rowData.department}
              phone={rowData.phone}
              address={rowData.address}
              website={rowData.website}
              availability={rowData.availability}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
