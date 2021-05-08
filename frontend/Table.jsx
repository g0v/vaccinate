// @flow
import * as React from 'react';
import Card from './Card';
import strings from './Table.json';

import type { Locale } from './Locale';
import type { Availability } from './Availability';

export type Hospital = {|
  hospitalId: Number,
  name: string,
  location: string,
  department: string,
  phone: string,
  address: string,
  website: string,
  availability: Availability,
|};

export default function Table(props: { rows: Array<Hospital>, locale: Locale }): React.Node {
  const { rows, locale } = props;

  const availableHospitals = rows.filter((row) => row.availability === 'Available');
  const unavailableHospitals = rows.filter((row) => row.availability === 'Unavailable');
  const noDataHospitals = rows.filter((row) => row.availability === 'No data');

  const makeCardGrid = (hospitals: Array<Hospital>, buttonText: string) => (
    <div className="row row-cols-4 row-cols-md-4 g-3">
      {hospitals.map((hospital) => (
        <div className="col" key={hospital.hospitalId.toString()}>
          <Card
            address={hospital.address}
            availability={hospital.availability}
            buttonText={buttonText}
            department={hospital.department}
            hospitalId={hospital.hospitalId}
            locale={locale}
            location={hospital.location}
            name={hospital.name}
            phone={hospital.phone}
            website={hospital.website}
          />
        </div>
      ))}
    </div>
  );
  return (
    <div>
      <h3>{strings.hospitalsWithAppointmentsTitle[locale]}</h3>
      <i>{strings.hospitalsWithAppointmentsSubtitle[locale]}</i>
      {makeCardGrid(availableHospitals, strings.buttons.getAppointment[locale])}
      <h3>{strings.hospitalsWithNoDataTitle[locale]}</h3>
      <i>{strings.hospitalsWithNoDataSubtitle[locale]}</i>
      {makeCardGrid(noDataHospitals, strings.buttons.visitWebsite[locale])}
      <h3>{strings.hospitalsWithNoAppointmentsTitle[locale]}</h3>
      <i>{strings.hospitalsWithNoAppointmentsSubtitle[locale]}</i>
      {makeCardGrid(unavailableHospitals, strings.buttons.visitWebsite[locale])}
    </div>
  );
}
