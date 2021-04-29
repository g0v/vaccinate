// @flow
import * as React from 'react';
import { render } from 'react-dom';
import App from './App';


export type Hospital = {|
    hospital_id: Number,
        name: string,
            location: string,
                department: string,
                    phone: string,
                        address: string,
                            website: string,
                                availability: string,
    |};

export default function Row(props: {
    hospital_id: Number,
    name: string,
    location: string,
    department: string,
    phone: string,
    address: string,
    website: string,
    availability: string,
}): React.Node {
    return <tr>
        <td>{props.hospital_id.toString()}</td>
        <td>{props.name}</td>
        <td>{props.location}</td>
        <td>{props.department}</td>
        <td>{props.phone}</td>
        <td>{props.address}</td>
        <td><a href={props.website}>Register here</a></td>
        <td>{props.availability}</td>
    </tr>;
}