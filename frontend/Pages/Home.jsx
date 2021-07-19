// @flow
import * as React from 'react';
import VaccineInfo from '../Components/VaccineInfo';

import type { Hospital } from '../Types/Hospital';

/**
 * Parses untyped data from our server and ensures it fits the
 * type declared in ../Types/Hospital.
 */
function refineUntypedHospital(rawData: any): Hospital {
  return {
    address: rawData.address,
    department: rawData.department,
    governmentPaidAvailability: rawData.governmentPaidAvailability,
    hospitalId: rawData.hospitalId,
    location: rawData.location,
    district: rawData.district,
    name: rawData.name,
    phone: rawData.phone,
    selfPaidAvailability: rawData.selfPaidAvailability,
    website: rawData.website,
  };
}

export default function Home(): React.Node {
  const [rows, setRows] = React.useState([]);
  const apiURL = process.env.API_URL || '';
  const [selectedLocation, setLocation] = React.useState('臺北市');
  const [selectedDistrict, setDistrict] = React.useState(null);
  React.useEffect(() => {
    setRows([]);
    const url = new URL(`${apiURL}/government_paid_hospitals`);
    url.searchParams.set('city', selectedLocation);
    fetch(url)
      .then((data) => data.json())
      .then((res) => {
        setRows(res.map((row) => refineUntypedHospital(row)));
      });
  }, [selectedLocation]); // Run effect when city is changed

  return (
    <>
      <VaccineInfo
        vaccineType="GovernmentPaid"
        rows={rows}
        selectedLocation={selectedLocation}
        setLocation={setLocation}
        selectedDistrict={selectedDistrict}
        setDistrict={setDistrict}
      />
    </>
  );
}
