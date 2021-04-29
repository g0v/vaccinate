// @flow
import * as React from 'react';
import Map from './Map';
import Table from './Table';

export default function App(): React.Node {
  const [rows, setRows] = React.useState([]);
  const url = 'http://localhost:5000/hospitals';
  fetch(url).then((data) => data.json()).then((res) => setRows(res));
  return (
    <div>
      <Table rows={rows} />
      <Map />
    </div>
  );
}
