// @flow
import * as React from 'react';
import Content from './Components/Content';
import Map from './Components/Map';
import VaccineDataGrid from './Components/VaccineDataGrid';
import Spinner from './Components/Spinner';
import G0vbar from './Components/G0vbar';
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
      <div className="container">
        <h1 style={{ textAlign: 'center', marginTop: 30 }}>{strings.websiteTitle[locale]}</h1>
        <div className="row" style={{ marginTop: 50 }}>
          <div className="col">
            <Content setLocale={setLocale} />
          </div>
          <div className="col d-none d-md-block">
            <Map />
          </div>
        </div>
        <h2 style={{ textAlign: 'center' }}>{strings.vaccineAvailability[locale]}</h2>
        <div style={{ textAlign: 'center' }}>
          <form
            className="btn-group"
            role="group"
            aria-label="Select type of vaccination."
          >
            {/* eslint-disable jsx-a11y/label-has-associated-control */}
            <input
              type="radio"
              className="btn-check"
              name="btnradio"
              id="btnradio1"
              autoComplete="off"
              onClick={() => setVaccineType('SelfPaid')}
              checked={vaccineType === 'SelfPaid'}
            />
            <label
              className="btn btn-outline-primary"
              htmlFor="btnradio1"
            >
              {strings.vaccineTypes.selfPaid[locale]}
            </label>
            <input
              type="radio"
              className="btn-check"
              name="btnradio"
              id="btnradio2"
              autoComplete="off"
              onClick={() => setVaccineType('GovernmentPaid')}
              checked={vaccineType === 'GovernmentPaid'}
            />
            <label
              className="btn btn-outline-primary"
              htmlFor="btnradio2"
            >
              {strings.vaccineTypes.governmentPaid[locale]}
            </label>
          </form>
        </div>
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
