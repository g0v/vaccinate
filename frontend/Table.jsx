// @flow
import * as React from 'react';
import { render } from 'react-dom';
import Row from './Row';

import type { Hospital } from './Row';

export default function Table(props: { rows: Array<Hospital> }): React.Node {
    return <div>
        <table className="table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Hospital Name</th>
                    <th>Location</th>
                    <th>Department</th>
                    <th>Phone</th>
                    <th>Address</th>
                    <th>Website</th>
                    <th>Availability</th>
                </tr>
            </thead>
            <tbody>
                {props.rows.map(rowData => <Row key={rowData.hospital_id.toString()}
                    hospital_id={rowData.hospital_id}
                    name={rowData.name}
                    location={rowData.location}
                    department={rowData.department}
                    phone={rowData.phone}
                    address={rowData.address}
                    website={rowData.website}
                    availability={rowData.availability}
                />)}
            </tbody>
        </table></div >;
}