// @flow
import * as React from 'react';
import Card from './Card';
import { getAvailability } from '../../Types/Hospital';

import type { Hospital } from '../../Types/Hospital';
import type { VaccineType } from '../../Types/VaccineType';

export default function Cards(props: {
  hospitals: Hospital[],
  vaccineType: VaccineType,
  buttonText: string,
}): React.Node {
  const { hospitals, buttonText, vaccineType } = props;

  return hospitals.map((hospital) => (
    <div className="col" key={hospital.hospitalId.toString()}>
      <Card
        address={hospital.address}
        availability={getAvailability(hospital, vaccineType)}
        buttonText={buttonText}
        department={hospital.department}
        location={hospital.location}
        district={hospital.district}
        name={hospital.name}
        phone={hospital.phone}
        website={hospital.website}
        lastModified={hospital.lastModified}
      />
    </div>
  ));
}
