// @flow
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import VaccineInfo from '../Components/VaccineInfo';
import Spinner from '../Components/Spinner';

export default function Home(): React.Node {
  const [rows, setRows] = React.useState([]);
  const [vaccineType, setVaccineType] = React.useState('GovernmentPaid');
  const [gt] = useTranslation('app');
  React.useEffect(() => {
    const url = vaccineType === 'SelfPaid' ? './self_paid_hospitals' : './government_paid_hospitals';
    fetch(url).then((data) => data.json()).then((res) => setRows(res));
  }, [vaccineType]); // Empty list makes this useEffect similar to componentDidMount();

  return (
    <>
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
                  onClick={() => { setRows([]); setVaccineType('SelfPaid'); }}
                  checked={vaccineType === 'SelfPaid'}
                />
                <label
                  className="btn btn-outline-primary"
                  htmlFor="btnradio1"
                >
                  { gt('txt-selfPaidVaccine') }
                </label>
                <input
                  type="radio"
                  className="btn-check"
                  name="btnradio"
                  id="btnradio2"
                  autoComplete="off"
                  onClick={() => { setRows([]); setVaccineType('GovernmentPaid'); }}
                  checked={vaccineType === 'GovernmentPaid'}
                />
                <label
                  className="btn btn-outline-primary"
                  htmlFor="btnradio2"
                >
                  { gt('txt-governmentPaidVaccine') }
                </label>
              </form>
            </div>
            <VaccineInfo
              vaccineType={vaccineType}
              rows={rows}
            />
          </>
        )}
    </>
  );
}
