// @flow
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import DataGrid from './VaccineInfo/DataGrid';
import { getAvailability } from '../Types/Hospital';
import { getCityList } from '../Types/Location';

import type { Location } from '../Types/Location';
import type { Hospital } from '../Types/Hospital';
import type { VaccineType } from '../Types/VaccineType';

export default function VaccineInfo(
  props: { rows: Array<Hospital>, vaccineType: VaccineType },
): React.Node {
  const { rows, vaccineType } = props;
  const { t } = useTranslation('dataGrid');

  const availableHospitals = rows.filter((row) => getAvailability(row, vaccineType) === 'Available');
  const unavailableHospitals = rows.filter((row) => getAvailability(row, vaccineType) === 'Unavailable');
  const noDataHospitals = rows.filter((row) => getAvailability(row, vaccineType) === 'No data');
  const locations: Location[] = getCityList();

  const [selectedLocation, setLocation] = React.useState('新北市');

  function changeLocations(event) {
    setLocation(event.target.value);
  }

  return (
    <div>
      <div style={{ height: '90vh' }} className="d-flex justify-content-center align-items-center text-center">
        <div className="flex-fill">
          <h1 className="mb-4">💉</h1>
          <h2>在台灣找到離你最近的疫苗</h2>
          <p>Find the vaccine closest to you in Taiwan.</p>
          <div className="mt-5">
            <h2>選擇施打點所在縣市</h2>
            <p>請問您想搜尋哪一個縣市的施打點？</p>
            <select name="locations" className="form-select" onChange={changeLocations} value={selectedLocation}>
              {
                locations.map((location) => (
                  <option value={location}>{location}</option>
                ))
              }
            </select>
          </div>
        </div>
      </div>
      <div className="mb-4">
        <DataGrid
          selectedLocation={selectedLocation}
          hospitals={availableHospitals}
          buttonText={t('btn-getAppointment')}
          vaccineType={vaccineType}
        />
        <DataGrid
          selectedLocation={selectedLocation}
          hospitals={noDataHospitals}
          buttonText={t('btn-visitWebsite')}
          vaccineType={vaccineType}
        />
        <DataGrid
          selectedLocation={selectedLocation}
          hospitals={unavailableHospitals}
          buttonText={t('btn-visitWebsite')}
          vaccineType={vaccineType}
        />
      </div>
      <hr />
      <div className="text-center">
        <h1>😷</h1>
        <p>
          以上就是所有您所要求的疫苗預約資訊，
          <br />
          出去要記得配戴口罩喔！
        </p>
      </div>
    </div>
  );
}
