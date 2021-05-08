// @flow
import * as React from 'react';
import Row from './Row';
import Card from './Card';

import type { Hospital } from './Row';

export default function Table(props: { rows: Array<Hospital> }): React.Node {
  const { rows } = props;
  const nestedRows = rows.reduce(
    (accumulator, currentValue, index) =>
      index % 4 === 0
        ? accumulator.concat([rows.slice(index, index + 4)])
        : accumulator
    , []);
  console.log(nestedRows);
  return (
    <div>
      {nestedRows.map(row => (
        <div className="row row-cols-4">
          {row.map(col =>
            <div className="col">
              <Card key={col.hospitalId.toString()}
                hospitalId={col.hospitalId}
                name={col.name}
                location={col.location}
                department={col.department}
                phone={col.phone}
                address={col.address}
                website={col.website}
                availability={col.availability} />
            </div>)}
        </div>
      ))}
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
