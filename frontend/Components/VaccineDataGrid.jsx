// @flow
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import Cards from './VaccineDataGrid/Cards';
import Accordion from './VaccineDataGrid/Accordion';
import AccordionItem from './VaccineDataGrid/AccordionItem';
import { getAvailability } from '../Types/Hospital';

import type { Hospital } from '../Types/Hospital';
import type { VaccineType } from '../Types/VaccineType';
import type { Availability } from '../Types/Availability';
import type { Location } from '../Types/Location';

export default function VaccineDataGrid(
  props: { rows: Array<Hospital>, vaccineType: VaccineType },
): React.Node {
  const { rows, vaccineType } = props;
  const { t } = useTranslation('dataGrid');

  const availableHospitals = rows.filter((row) => getAvailability(row, vaccineType) === 'Available');
  const unavailableHospitals = rows.filter((row) => getAvailability(row, vaccineType) === 'Unavailable');
  const noDataHospitals = rows.filter((row) => getAvailability(row, vaccineType) === 'No data');

  const gridForAvailability = (
    hospitals: Array<Hospital>,
    buttonText: string,
    availability: Availability,
  ) => {
    if (hospitals.length === 0) {
      return (
        <div style={{ textAlign: 'center' }}>
          <p className="lead"><i>{t('txt-noHospitals')}</i></p>
        </div>
      );
    }

    const hospitalsByCity = hospitals.reduce((byCity: { [Location]: Hospital[] }, hospital) => {
      if (hospital.location in byCity) {
        byCity[hospital.location].push(hospital);
        return byCity;
      }

      const newLocation = {};
      newLocation[hospital.location] = [hospital];
      return { ...byCity, ...newLocation };
    }, {});

    const makeAccordionID: (Availability) => string = (a) => `accordian-${a.split(' ').join('_')}`;
    const makeCollapseID: (string) => string = (l) => `accordian-collapse-${l}-${availability
      .split(' ')
      .join('_')}`;
    const makeCardGrid: (Hospital[]) =>
      React.Node = (localHospitals) => (
        <div className="row row-cols-1 row-cols-md-4 g-3">
          <Cards hospitals={localHospitals} buttonText={buttonText} vaccineType={vaccineType} />
        </div>
      );

    return (hospitals.length <= 20 ? makeCardGrid(hospitals)
      : (
        <Accordion id={makeAccordionID(availability)}>
          {Object
            .entries(hospitalsByCity)
            .map(([location: Location, locHospitals: Hospital[]], index: number) => (
              <AccordionItem
                id={makeCollapseID(location)}
                title={location}
                parentID={makeAccordionID(availability)}
                key={location}
              >
                {/* $FlowFixMe[incompatible-call]: Object.entries is unsound and returns mixed. */}
                {makeCardGrid(locHospitals)}
              </AccordionItem>
            ))}
        </Accordion>
      )
    );
  };
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
        {gridForAvailability(availableHospitals, t('btn-getAppointment'), 'Available')}
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
        {gridForAvailability(noDataHospitals, t('btn-visitWebsite'), 'No Data')}
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
        {gridForAvailability(unavailableHospitals, t('btn-visitWebsite'), 'Unavailable')}
      </div>
    </div>
  );
}
