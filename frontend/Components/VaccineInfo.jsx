// @flow
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import DataGrid from './VaccineInfo/DataGrid';
import { getAvailability } from '../Types/Hospital';

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

  return (
    <div>
      <div style={{ marginTop: 20 }}>
        <h3>{t('txt-hospitalsWithAppointmentsTitle')}</h3>
        <p>
          <i>
            {vaccineType === 'SelfPaid'
              ? t('dataGrid:hospitalsWithAppointmentsSubtitle:txt-selfPaid')
              : t('dataGrid:hospitalsWithAppointmentsSubtitle:txt-governmentPaid')}
          </i>
        </p>
        <DataGrid
          hospitals={availableHospitals}
          buttonText={t('btn-getAppointment')}
          vaccineType={vaccineType}
        />
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
        <DataGrid
          hospitals={noDataHospitals}
          buttonText={t('btn-visitWebsite')}
          vaccineType={vaccineType}
        />
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
        <DataGrid
          hospitals={unavailableHospitals}
          buttonText={t('btn-visitWebsite')}
          vaccineType={vaccineType}
        />
      </div>
    </div>
  );
}
