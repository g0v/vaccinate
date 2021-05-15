// @flow
import * as React from 'react';
import Card from './Card';
// $FlowFixMe: Flow doesn't like importing Yaml but Parcel can.
import strings from '../Strings/VaccineDataGrid.yaml';

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

  const makeCardGrid = (hospitals: Array<Hospital>, buttonText: string) => (hospitals.length !== 0
    ? (
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
    ) : (
      <div style={{ textAlign: 'center' }}>
        <p className="lead"><i>{strings.noHospitals[locale]}</i></p>
      </div>
    ));
  return (
    <div>
      {
        vaccineType === 'SelfPaid' ? (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center', maxWidth: 800 }}>
              <p>
                <b>
                  {strings.selfPaidVaccineClosure.notice[locale]}
                </b>
              </p>
              <p>
                {strings.selfPaidVaccineClosure.selfPaid2ndShot[locale]}
              </p>
            </div>
          </div>
        ) : null
      }
      <div style={{ marginTop: 20 }}>
        <h3>{strings.hospitalsWithAppointmentsTitle[locale]}</h3>
        <p>
          <i>
            {vaccineType === 'SelfPaid'
              ? strings.hospitalsWithAppointmentsSubtitle.selfPaid[locale]
              : strings.hospitalsWithAppointmentsSubtitle.governmentPaid[locale]}
          </i>
        </p>
        {makeCardGrid(availableHospitals, strings.buttons.getAppointment[locale])}
      </div>
      <div style={{ marginTop: 20 }}>
        <h3>{strings.hospitalsWithNoDataTitle[locale]}</h3>
        <p>
          <i>
            {vaccineType === 'SelfPaid'
              ? strings.hospitalsWithNoDataSubtitle.selfPaid[locale]
              : strings.hospitalsWithNoDataSubtitle.governmentPaid[locale]}
          </i>
        </p>
        {makeCardGrid(noDataHospitals, strings.buttons.visitWebsite[locale])}
      </div>
      <div style={{ marginTop: 20 }}>
        <h3>{strings.hospitalsWithNoAppointmentsTitle[locale]}</h3>
        <p>
          <i>
            {vaccineType === 'SelfPaid'
              ? strings.hospitalsWithNoAppointmentsSubtitle.selfPaid[locale]
              : strings.hospitalsWithNoAppointmentsSubtitle.governmentPaid[locale]}
          </i>
        </p>
        {makeCardGrid(unavailableHospitals, strings.buttons.visitWebsite[locale])}
      </div>
    </div>
  );
}
