// @flow
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import DataGrid from './VaccineInfo/DataGrid';
import { getAvailability } from '../Types/Hospital';
import { CITY_LIST } from '../Types/Location';

import type { Hospital } from '../Types/Hospital';
import type { Location } from '../Types/Location';
import type { VaccineType } from '../Types/VaccineType';

export default function VaccineInfo(props: {
  rows: Array<Hospital>,
  vaccineType: VaccineType,
  selectedLocation: Location,
  setLocation: (Location) => void,
  selectedDistrict: ?string,
  setDistrict: (?string) => void,
}): React.Node {
  const {
    rows,
    vaccineType,
    selectedLocation,
    setLocation,
    selectedDistrict,
    setDistrict,
  } = props;
  const { t } = useTranslation('dataGrid');

  const availableHospitals = rows.filter(
    (row) => getAvailability(row, vaccineType) === 'Available',
  );
  const unavailableHospitals = rows.filter(
    (row) => getAvailability(row, vaccineType) === 'Unavailable',
  );
  const noDataHospitals = rows.filter(
    (row) => getAvailability(row, vaccineType) === 'No data',
  );

  if (rows.length === 0) {
    return <div>{t('txt-loading')}</div>;
  }

  const districts = new Set(rows.map((hospital) => hospital.district));
  function changeLocations(event) {
    setLocation(event.target.value);
    setDistrict(null);
  }
  function changeDistrict(event) {
    setDistrict(event.target.value);
  }

  return (
    <div>
      <div
        style={{ height: '60vh' }}
        className="d-flex justify-content-center align-items-center text-center"
      >
        <div className="flex-fill">
          <h3 className="mb-4">💉</h3>
          <div className="mt-5">
            <h1>{t('txt-selectCity')}</h1>
            <p>{t('txt-selectCityQuestion')}</p>
            <div className="row justify-content-center">
              <div className="col-md-4 mb-2">
                <select
                  name="locations"
                  className="form-select"
                  onChange={changeLocations}
                  value={selectedLocation}
                >
                  {Object.keys(CITY_LIST).map((location) => (
                    <option value={location}>{location}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-4 mb-2">
                <select
                  name="county"
                  className="form-select"
                  onChange={changeDistrict}
                  value={selectedDistrict}
                >
                  <option value="">全部地區</option>
                  {[...districts].map((district) => (
                    <option value={district}>{district}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mb-4">
        <DataGrid
          selectedDistrict={selectedDistrict}
          hospitals={availableHospitals}
          buttonText={t('btn-getAppointment')}
          vaccineType={vaccineType}
        />
        <DataGrid
          selectedDistrict={selectedDistrict}
          hospitals={noDataHospitals}
          buttonText={t('btn-visitWebsite')}
          vaccineType={vaccineType}
        />
        <DataGrid
          selectedDistrict={selectedDistrict}
          hospitals={unavailableHospitals}
          buttonText={t('btn-visitWebsite')}
          vaccineType={vaccineType}
        />
      </div>
      <div className="text-center my-5 pt-5">
        <h2>😷</h2>
        <p>
          {t('txt-footerRemind1')}
          <br />
          {t('txt-footerRemind2')}
        </p>
        <p>
          {t('txt-footerRemind3')}
          <br />
          <br />
          <a href="https://airtable.com/shr3sBRtRraL5aehl" className="btn btn-primary px-5" target="_blank" rel="noreferrer">{t('txt-footerReport')}</a>
        </p>
      </div>
    </div>
  );
}
