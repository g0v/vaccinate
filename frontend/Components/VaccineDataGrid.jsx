// @flow
import * as React from 'react';
import Card from './Card';
import strings from '../Strings/Table.json';

import type { Locale } from '../Types/Locale';
import type { Hospital } from '../Types/Hospital';
import type { VaccineType } from '../Types/VaccineType';
import type { Availability } from '../Types/Availability';

export default function VaccineDataGrid(
  props: { rows: Array<Hospital>, locale: Locale, vaccineType: VaccineType },
): React.Node {
  const { rows, locale, vaccineType } = props;

  const getAvailability: (Hospital) => Availability = (hospital) => (vaccineType === 'SelfPaid'
    ? hospital.selfPaidAvailability : hospital.governmentPaidAvailability);

  const availableHospitals = rows.filter((row) => getAvailability(row) === 'Available');
  const unavailableHospitals = rows.filter((row) => getAvailability(row) === 'Unavailable');
  const noDataHospitals = rows.filter((row) => getAvailability(row) === 'No data');

  const makeCardGrid = (hospitals: Array<Hospital>, buttonText: string) => (
    <div className="row row-cols-1 row-cols-md-4 g-3">
      {hospitals.map((hospital) => (
        <div className="col" key={hospital.hospitalId.toString()}>
          <Card
            address={hospital.address}
            availability={getAvailability(hospital)}
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
