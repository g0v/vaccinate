// @flow
import * as React from 'react';
import Content from '../Components/Content';
import Map from '../Components/Map';
import VaccineDataGrid from '../Components/VaccineDataGrid';
import Spinner from '../Components/Spinner';

import type { Language, Locale } from '../Types/Locale';
import type { VaccineType } from '../Types/VaccineType';

// $FlowFixMe: Flow doesn't like importing Yaml but Parcel can.
import strings from '../Strings/Home.yaml';

export default function Home(props: { language: Language, locale: Locale, vaccineType: VaccineType }): React.Node {
  const { language, locale, vaccineType } = props;
  const [rows, setRows] = React.useState([]);
  const url = './hospitals';
  fetch(url).then((data) => data.json()).then((res) => setRows(res));

  return (
    <>
      <div className="row" style={{ marginTop: 50 }}>
        <div className="col">
          <Content language={language} />
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
    </>
  );
}
