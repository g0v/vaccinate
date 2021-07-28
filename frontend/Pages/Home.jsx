// @flow
import * as React from 'react';
import { useHistory } from 'react-router-dom';
import querystring from 'query-string';

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
  const history = useHistory();

  const apiURL = process.env.API_URL || '';
  const [selectedLocation, setLocation] = React.useState();
  const [selectedDistrict, setDistrict] = React.useState(null);
  const [selectedVaccineType, setVaccineType] = React.useState(null);

  React.useEffect(() => {
    const searchParams = querystring.parse(window.location.search);
    const location = searchParams.location || '臺北市';
    const vaccineType = searchParams.vaccine_type || 'GovernmentPaid'; // SelfPaid
    setLocation(location);
    setVaccineType(vaccineType);
  }, []);

  React.useEffect(() => {
    if (!selectedLocation) return;

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

        const searchParams = querystring.parse(window.location.search);
        searchParams.location = selectedLocation;
        searchParams.vaccine_type = selectedVaccineType;

        history.push({
          search: `?${querystring.stringify(searchParams)}`,
        });
      });
  }, [selectedLocation]); // Run effect when city is changed

  if (!selectedLocation || !selectedVaccineType) return null;

  return (
    <>
      <VaccineInfo
        vaccineType={selectedVaccineType}
        rows={rows}
        selectedLocation={selectedLocation}
        setLocation={setLocation}
        selectedDistrict={selectedDistrict}
        setDistrict={setDistrict}
      />
    </>
  );
}
