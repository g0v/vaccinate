// @flow
import * as React from 'react';
import Row from './Row';

import type { Hospital } from './Row';

export default function Table(props: { rows: Array<Hospital> }): React.Node {
  const { rows } = props;
  const availableHospitals = rows.filter(row => row.availability === "Available");
  const unavailableHospitals = rows.filter(row => row.availability === "Unavailable");
  const noDataHospitals = rows.filter(row => row.availability === "No Data");
  return (
    <div>
      <div className="row row-cols-4">
        <div className="col">
          <div className="card">
            <img src="..." className="card-img-top" alt="..." />
            <div className="card-body">
              <h5 className="card-title">Hospital Name</h5>
              <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
              <a href="#" className="btn btn-primary">Go somewhere</a>
            </div>
          </div>
        </div>
        <div className="col">Column</div>
        <div className="col">Column</div>
        <div className="col">Column</div>
      </div>
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
