// @flow
import * as React from 'react';
import { useLocaleContext } from '../Context/Locale'
import Content from '../Components/Content';
import Map from '../Components/Map';
import VaccineDataGrid from '../Components/VaccineDataGrid';
import Spinner from '../Components/Spinner';

// $FlowFixMe: Flow doesn't like importing Yaml but Parcel can.
import strings from '../Strings/Home.yaml';

export default function Home(): React.Node {
  const [rows, setRows] = React.useState([]);
  const [vaccineType, setVaccineType] = React.useState('GovernmentPaid');
  const { locale } = useLocaleContext()
  const url = './hospitals';

  React.useEffect(() => {
    fetch(url).then((data) => data.json()).then((res) => setRows(res));
  }, []); // Empty list makes this useEffect similar to componentDidMount();

  return (
    <>
      <div className="row" style={{ marginTop: 50 }}>
        <div className="col">
          <Content />
        </div>
        <div className="col d-none d-md-block">
          <Map />
        </div>
      </div>
      <h2 style={{ textAlign: 'center' }}>{strings.vaccineAvailability[locale]}</h2>
      {rows.length === 0 ? <Spinner />
        : (
          <>
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
            <VaccineDataGrid
              vaccineType={vaccineType}
              rows={rows}
              locale={locale}
            />
          </>
        )}
    </>
  );
}
