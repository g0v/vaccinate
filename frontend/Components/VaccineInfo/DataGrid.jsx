// @flow
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import Cards from './Cards';
import { getLocationName } from '../../Types/Location';

import type { Hospital } from '../../Types/Hospital';
import type { Location } from '../../Types/Location';
import type { VaccineType } from '../../Types/VaccineType';

export default function DataGrid(props: {
  hospitals: Hospital[],
  buttonText: string,
  vaccineType: VaccineType,
}): React.Node {
  const { t } = useTranslation('dataGrid');
  const [cityT] = useTranslation('city');
  const {
    hospitals, buttonText, vaccineType,
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

  const locations: string[] = Object.keys(hospitalsByCity);
  const [selectedLocation, setLocation] = React.useState(locations[0]);

  const makeCardGrid: (Hospital[]) =>
  React.Node = (localHospitals) => (
    <div className="row row-cols-1 row-cols-md-4 g-3">
      <Cards hospitals={localHospitals} buttonText={buttonText} vaccineType={vaccineType} />
    </div>
  );

  return (hospitals.length <= 20 ? makeCardGrid(hospitals)
    : (
      <>
        {
        locations.map(
          (location) => (
            <button
              key={location}
              className={
                location === selectedLocation
                  ? 'badge rounded-pill bg-light text-dark'
                  : 'badge rounded-pill bg-dark'
              }
              onClick={() => setLocation(location)}
              style={{
                fontSize: '1em',
                marginRight: 10,
                marginBottom: 10,
                border: 'none',
              }}
              type="button"
            >
              {/* $FlowFixMe: Casting from enum to string. */}
              {getLocationName(location, cityT)}
            </button>
          ),
        )
      }
        {/* $FlowFixMe: Casting from enum to string. */}
        <h4 style={{ marginTop: '2em', marginBottom: '0.5em', textAlign: 'center' }}>{getLocationName(selectedLocation, cityT)}</h4>
        {/* $FlowFixMe: Casting from a string to an Enum. */}
        {makeCardGrid(hospitalsByCity[selectedLocation])}
      </>
    )
  );
}
