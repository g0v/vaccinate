// @flow
import * as React from 'react';
import Card from './Card';
import strings from './Table.json';

import type { Locale } from './Locale';

export type Hospital = {|
  hospitalId: Number,
  name: string,
  location: string,
  department: string,
  phone: string,
  address: string,
  website: string,
  availability: string,
|};

export default function Table(props: { rows: Array<Hospital>, locale: Locale }): React.Node {
  const { rows, locale } = props;

  const availableHospitals = rows.filter((row) => row.availability === 'Available');
  const unavailableHospitals = rows.filter((row) => row.availability === 'Unavailable');
  const noDataHospitals = rows.filter((row) => row.availability === 'No data');

  const makeCardGrid = (hospitals) => (
    <div className="row row-cols-4 row-cols-md-4 g-3">
      {hospitals.map((hospital) => (
        <div className="col">
          <Card
            key={hospital.hospitalId.toString()}
            hospitalId={hospital.hospitalId}
            name={hospital.name}
            location={hospital.location}
            department={hospital.department}
            phone={hospital.phone}
            address={hospital.address}
            website={hospital.website}
            availability={hospital.availability}
          />
        </div>
      ))}
    </div>
  );
  return (
    <div>
      <h3>{strings.hospitalsWithAppointmentsTitle[locale]}</h3>
      <i>We have confirmed that these hospitals have appointments available.</i>
      {makeCardGrid(availableHospitals)}
      <h3>Hospitals with No Data</h3>
      <i>We don&apos;t know if this hospital has appointments. Please check their website.</i>
      {makeCardGrid(noDataHospitals)}
      <h3>Hospitals with No Appointments</h3>
      <i>These hospitals have no appointments.</i>
      {makeCardGrid(unavailableHospitals)}
    </div>
  );
}
