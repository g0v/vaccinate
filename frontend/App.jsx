// @flow
import * as React from 'react';
import Content from './Content';
import Map from './Map';
import Table from './Table';
import Spinner from './Spinner';

import type { Locale } from './Locale';

export default function App(): React.Node {
  const [rows, setRows] = React.useState([]);
  const [locale: Locale, setLocale] = React.useState('zh');
  const url = './hospitals';
  fetch(url).then((data) => data.json()).then((res) => setRows(res));
  return (
    <div>
      <h1 style={{ textAlign: 'center', marginTop: 30 }}>全民新冠肺炎疫苗資訊 COVID-19 Vaccination Information</h1>
      <div className="row" style={{ marginTop: 50 }}>
        <div className="col">
          <Content setLocale={setLocale.bind(this)} />
        </div>
        <div className="col">
          <Map />
        </div>
      </div>
      <h2 style={{ textAlign: 'center' }}>Vaccination Availability</h2>
      {rows.length === 0 ? <Spinner />
        : <Table rows={rows} locale={locale} />}
      <p><i>Created with love by a member of g0v, Taiwans civic tech community.</i></p>
    </div>
  );
}
