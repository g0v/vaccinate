/* eslint-disable max-len */
// @flow

import * as React from 'react';
import Cards from './Cards';

import type { Hospital } from '../../Types/Hospital';
import type { VaccineType } from '../../Types/VaccineType';

const objectPropsAlphabetSorting = (key, ascending) => (a, b) => {
  if (a[key] === b[key]) {
    return 0;
  }
  if (a[key] === null) {
    return 1;
  }
  if (b[key] === null) {
    return -1;
  }
  if (ascending) {
    return a[key] < b[key] ? -1 : 1;
  }
  return a[key] < b[key] ? 1 : -1;
};

export default function DataGrid(props: {
  hospitals: Hospital[],
  buttonText: string,
  vaccineType: VaccineType,
  selectedDistrict: ?string,
}): React.Node {
  const {
    hospitals: inHospitals, buttonText, vaccineType, selectedDistrict,
  } = props;

  if (inHospitals.length === 0) {
    return <div> </div>;
  }

  const hospitals = inHospitals
    .filter((hospital) => hospital !== undefined)
    .filter(
      (hospital) => (selectedDistrict ? hospital.district === selectedDistrict : true),
    )
    .sort(objectPropsAlphabetSorting('website', true));

  const makeCardGrid: (Hospital[]) => React.Node = (localHospitals) => (
    <div className="row row-cols-1 row-cols-md-3 g-3">
      <Cards
        hospitals={localHospitals}
        buttonText={buttonText}
        vaccineType={vaccineType}
      />
    </div>
  );

  return makeCardGrid(hospitals);
}
