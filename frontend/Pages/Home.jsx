// @flow
import * as React from 'react';
import VaccineInfo from '../Components/VaccineInfo';

import type { Hospital } from '../Types/Hospital';

/**
 * Parses untyped data from our server and ensures it fits the
 * type declared in ../Types/Hospital.
 */
function refineUntypedHospital(rawData: any, links: any): Hospital {
  const primaryKey = rawData.location + rawData.name;
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
    website: primaryKey in links ? links[primaryKey] : [{ title: null, link: rawData.website }],
    lastModified: rawData.lastModified,
  };
}

export default function Home(): React.Node {
  const [rows, setRows] = React.useState([]);
  const apiURL = process.env.API_URL || '';
  const [selectedLocation, setLocation] = React.useState('臺北市');
  const [selectedDistrict, setDistrict] = React.useState(null);
  React.useEffect(() => {
    setRows([]);
    const urlGetHospitals = new URL(`${apiURL}/government_paid_hospitals`);
    urlGetHospitals.searchParams.set('city', selectedLocation);
    fetch(urlGetHospitals)
      .then((data) => data.json())
      .then((res) => {
        const urlGetLinks = new URL(`${apiURL}/hospitals_links`);
        urlGetLinks.searchParams.set('city', selectedLocation);
        fetch(urlGetLinks)
          .then((data) => data.json())
          .then((links) => {
            setRows(res.map((row) => refineUntypedHospital(row, links)));
          });
      });
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
          selectedDistrict={selectedDistrict}
          setDistrict={setDistrict}
        />
      )}
    </>
  );
}
