// @flow
import * as React from 'react';
import VaccineInfo from '../Components/VaccineInfo';

export default function Home(): React.Node {
  const [rows, setRows] = React.useState([]);
  const apiURL = process.env.API_URL || '';
  const [selectedLocation, setLocation] = React.useState('臺北市');
  React.useEffect(() => {
    setRows([]);
    const url = new URL(`${apiURL}/government_paid_hospitals`);
    url.searchParams.set('city', selectedLocation);
    fetch(url)
      .then((data) => data.json())
      .then((res) => setRows(res));
  }, [selectedLocation]); // Run effect when city is changed

  return (
    <>
      {rows.length === 0 ? (
        <div>Loading</div>
      ) : (
        <VaccineInfo
          vaccineType="GovernmentPaid"
          rows={rows}
          selectedLocation={selectedLocation}
          setLocation={setLocation}
        />
      )}
    </>
  );
}
