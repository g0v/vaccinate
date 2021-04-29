// @flow
import * as React from 'react';
import { render } from 'react-dom';
import Map from './Map';
import Table from './Table';

export default function App(props: {}): React.Node {
    const [rows, setRows] = React.useState([]);
    const url = 'http://localhost:5000/hospitals';
    fetch(url).then(data => data.json()).then(res => setRows(res));
    console.log("Rows is: ", rows);
    return <div>
        <Table rows={rows} />
        <Map />
    </div>;
}