// @flow
import * as React from 'react';
import Map from './Map';
import Table from './Table';
import Spinner from './Spinner';

export default function App(): React.Node {
  const [rows, setRows] = React.useState([]);
  const url = './hospitals';
  fetch(url).then((data) => data.json()).then((res) => setRows(res));
  return (
    <div>
      {rows.length === 0 ? <Spinner />
        : <Table rows={rows} />}
      <Map />
    </div>
  );
}
