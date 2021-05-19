// @flow
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import Card from './Card';

import type { Hospital } from '../Types/Hospital';
import type { VaccineType } from '../Types/VaccineType';
import type { Availability } from '../Types/Availability';

export default function VaccineDataGrid(
  props: { rows: Array<Hospital>, vaccineType: VaccineType },
): React.Node {
  const { rows, vaccineType } = props;
  const { t } = useTranslation('dataGrid');

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
        <p className="lead"><i>{t('txt-noHospitals')}</i></p>
      </div>
    ));
  return (
    <div>
      {
        vaccineType === 'SelfPaid' ? (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
            <div className="alert alert-warning" role="alert" style={{ textAlign: 'center', maxWidth: 800 }}>
              <p>
                <b>
                  {t('dataGrid:selfPaidVaccineClosure:txt-notice')}
                </b>
              </p>
              <p>
                {t('dataGrid:selfPaidVaccineClosure:txt-selfPaid2ndShot')}
              </p>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
            <div className="alert alert-warning" role="alert" style={{ textAlign: 'center', maxWidth: 800 }}>
              <p>
                {t('txt-govPaidVaccineDataIncomplete')}
              </p>
            </div>
          </div>
        )
      }
      <div style={{ marginTop: 20 }}>
        <h3>{t('txt-hospitalsWithAppointmentsTitle')}</h3>
        <p>
          <i>
            {vaccineType === 'SelfPaid'
              ? t('dataGrid:hospitalsWithAppointmentsSubtitle:txt-selfPaid')
              : t('dataGrid:hospitalsWithAppointmentsSubtitle:txt-governmentPaid')}
          </i>
        </p>
        {makeCardGrid(availableHospitals, t('btn-getAppointment'))}
      </div>
      <div style={{ marginTop: 20 }}>
        <h3>{t('txt-hospitalsWithNoDataTitle')}</h3>
        <p>
          <i>
            {vaccineType === 'SelfPaid'
              ? t('dataGrid:hospitalsWithNoDataSubtitle:txt-selfPaid')
              : t('dataGrid:hospitalsWithNoDataSubtitle:txt-governmentPaid')}
          </i>
        </p>
        {makeCardGrid(noDataHospitals, t('btn-visitWebsite'))}
      </div>
      <div style={{ marginTop: 20 }}>
        <h3>{t('txt-hospitalsWithNoAppointmentsTitle')}</h3>
        <p>
          <i>
            {vaccineType === 'SelfPaid'
              ? t('dataGrid:hospitalsWithNoAppointmentsSubtitle:txt-selfPaid')
              : t('dataGrid:hospitalsWithNoAppointmentsSubtitle:txt-governmentPaid')}
          </i>
        </p>
        {makeCardGrid(unavailableHospitals, t('btn-visitWebsite'))}
      </div>
    </div>
  );
}
