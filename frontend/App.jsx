// @flow
import * as React from 'react';
import Content from './Components/Content';
import Map from './Components/Map';
import VaccineDataGrid from './Components/VaccineDataGrid';
import Spinner from './Components/Spinner';
import G0vbar from './Components/G0vbar';
import Criteria from './Components/Criteria';
import Navbar from './Components/Navbar';
import LanguageSelector from './Components/LanguageSelector';
// $FlowFixMe: Flow doesn't like importing Yaml but Parcel can.
import strings from './Strings/App.yaml';

import type { Locale } from './Types/Locale';
import type { VaccineType } from './Types/VaccineType';

export default function App(): React.Node {
  const [rows, setRows] = React.useState([]);
  const [locale: Locale, setLocale] = React.useState('zh');
  const [vaccineType: VaccineType, setVaccineType] = React.useState('GovernmentPaid');
  const url = './hospitals';
  fetch(url).then((data) => data.json()).then((res) => setRows(res));
  return (
    <div>
      <G0vbar locale={locale} />
      <Navbar />
      <div className="container">
        <h1 style={{ textAlign: 'center', marginTop: 30 }}>{strings.websiteTitle[locale]}</h1>
        <div className="row" style={{ marginTop: 50 }}>
          <div className="col">
            <LanguageSelector />
            <Content setLocale={setLocale} />
            <Criteria />
          </div>
          <div className="col d-none d-md-block">
            <Map />
          </div>
        </div>
        <h2 style={{ textAlign: 'center' }}>{strings.vaccineAvailability[locale]}</h2>
        {rows.length === 0 ? <Spinner />
          : (
            <VaccineDataGrid
              vaccineType={vaccineType}
              rows={rows}
              locale={locale}
            />
          )}
        <p><i>Created with love by a member of g0v, Taiwans civic tech community.</i></p>
      </div>
    </div>
  );
}
