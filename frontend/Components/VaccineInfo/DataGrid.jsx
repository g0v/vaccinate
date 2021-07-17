/* eslint-disable max-len */
// @flow

import * as React from "react";
import Cards from "./Cards";

import type { Hospital } from "../../Types/Hospital";
import type { VaccineType } from "../../Types/VaccineType";

export default function DataGrid(props: {
  hospitals: Hospital[],
  buttonText: string,
  vaccineType: VaccineType,
  selectedDistrict: ?string,
}): React.Node {
  const { hospitals, buttonText, vaccineType, selectedDistrict } = props;

  if (hospitals.length === 0) {
    return <div> </div>;
  }

  const makeCardGrid: (Hospital[]) => React.Node = (localHospitals) => (
    <div className="row row-cols-1 row-cols-md-3 g-3">
      <Cards
        hospitals={localHospitals}
        buttonText={buttonText}
        vaccineType={vaccineType}
      />
    </div>
  );

  return hospitals.length <= 20 ? (
    makeCardGrid(hospitals)
  ) : (
    <>
      {/* $FlowFixMe: Casting from enum to string. */}
      {/* $FlowFixMe: Casting from a string to an Enum. */}
      {makeCardGrid(
        hospitals
          .filter((hospital) => hospital !== undefined)
          .filter(
            (hospital) =>
              selectedDistrict === null ||
              hospital.district === selectedDistrict
          )
      )}
    </>
  );
}
