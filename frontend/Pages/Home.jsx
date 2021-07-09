// @flow
import * as React from 'react';
import VaccineInfo from '../Components/VaccineInfo';

export default function Home(): React.Node {
  const [rows, setRows] = React.useState([]);
  const apiURL = process.env.API_URL || '';
  React.useEffect(() => {
    const url = '/government_paid_hospitals';
    fetch(apiURL + url).then((data) => data.json()).then((res) => setRows(res));
  }, []); // Empty list makes this useEffect similar to componentDidMount();

  return (
    <>
      <VaccineInfo
        vaccineType="GovernmentPaid"
        rows={rows}
      />
    </>
  );
}
