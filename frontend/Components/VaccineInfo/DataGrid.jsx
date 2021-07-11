/* eslint-disable max-len */
// @flow

import * as React from 'react';
import Cards from './Cards';

import type { Hospital } from '../../Types/Hospital';
import type { Location } from '../../Types/Location';
import type { VaccineType } from '../../Types/VaccineType';

export default function DataGrid(props: {
  hospitals: Hospital[],
  buttonText: string,
  vaccineType: VaccineType,
  selectedLocation: string
}): React.Node {
  const {
    hospitals, buttonText, vaccineType, selectedLocation,
  } = props;

  const hospitalsByCity = hospitals.reduce((byCity: { [Location]: Hospital[] }, hospital) => {
    if (hospital.location in byCity) {
      byCity[hospital.location].push(hospital);
      return byCity;
    }

    const newLocation = {};
    newLocation[hospital.location] = [hospital];
    return { ...byCity, ...newLocation };
  }, {});

  if (hospitals.length === 0) {
    return (
      <div> </div>
    );
  }

  const makeCardGrid: (Hospital[]) =>
  React.Node = (localHospitals) => ((localHospitals === undefined) ? (<></>)
    : (
      <div className="row row-cols-1 row-cols-md-3 g-3">
        <Cards hospitals={localHospitals} buttonText={buttonText} vaccineType={vaccineType} />
      </div>
    ));

  return (hospitals.length <= 20 ? makeCardGrid(hospitals)
    : (
      <>
        {/* $FlowFixMe: Casting from enum to string. */}
        {/* <h4 className="mt-4 mb-1 text-center">{getLocationName(selectedLocation, cityT)}</h4> */}
        {/* $FlowFixMe: Casting from a string to an Enum. */}
        {makeCardGrid(hospitalsByCity[selectedLocation])}
      </>
    )
  );
}
