// @flow
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import Accordion from './Accordion';
import AccordionItem from './AccordionItem';
import Cards from './Cards';

import type { Availability } from '../../Types/Availability';
import type { Hospital } from '../../Types/Hospital';
import type { Location } from '../../Types/Location';
import type { VaccineType } from '../../Types/VaccineType';

export default function DataGrid(props: {
  hospitals: Hospital[],
  buttonText: string,
  availability: Availability,
  vaccineType: VaccineType,
}): React.Node {
  const { t } = useTranslation('dataGrid');
  const {
    hospitals, buttonText, availability, vaccineType,
  } = props;
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
          .map(([location: Location, locHospitals: Hospital[]]) => (
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
}
