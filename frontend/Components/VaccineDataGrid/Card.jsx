// @flow
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import type { Availability } from '../../Types/Availability';
import type { Location } from '../../Types/Location';

function getBadgeClassname(availability: Availability): string {
  switch (availability) {
    case 'Available':
      return 'badge bg-success';
    case 'Unavailable':
      return 'badge bg-danger';
    default:
      return 'badge bg-light text-dark';
  }
}

function getBadgeText(availability: Availability, t): string {
  switch (availability) {
    case 'Available':
      return t('txt-available');
    case 'Unavailable':
      return t('txt-unavailable');
    case 'No Data':
    default:
      return t('txt-noData');
  }
}

function getLocationName(location: Location, t): string {
  switch (location) {
    case '基隆市':
      return t('txt-keelung');
    case '臺北市':
      return t('txt-taipei');
    case '新北市':
      return t('txt-newTaipeiCity');
    case '新竹縣':
      return t('txt-hsinchuCounty');
    case '新竹市':
      return t('txt-hsinchuCity');
    case '彰化縣':
      return t('txt-changhua');
    case '苗栗縣':
      return t('txt-miaoli');
    case '桃園市':
      return t('txt-taoyuan');
    case '宜蘭縣':
      return t('txt-yilan');
    case '臺中市':
      return t('txt-taichung');
    case '雲林縣':
      return t('txt-yunlin');
    case '南投縣':
      return t('txt-nantou');
    case '嘉義縣':
      return t('txt-chiayi');
    case '台南市':
      return t('txt-tainan');
    case '高雄市':
      return t('txt-kaohsiung');
    case '屏東縣':
      return t('txt-pingtung');
    case '花蓮縣':
      return t('txt-hualien');
    case '連江縣':
      return t('txt-lienjiang');
    case '澎湖縣':
      return t('txt-penghu');
    case '臺東縣':
      return t('txt-taitung');
    case '金門縣':
      return t('txt-kinmen');
    default:
      return location;
  }
}

export default function Card(props: {
  address: string,
  availability: Availability,
  buttonText: string,
  department: string,
  location: Location,
  name: string,
  phone: string,
  website: string,
}): React.Node {
  const {
    address,
    availability,
    buttonText,
    department,
    location,
    name,
    phone,
    website,
  } = props;

  const [cardT] = useTranslation('card');
  const [cityT] = useTranslation('city');

  return (
    <div className="card">
      <div className="card-body">
        <p className="card-text">
          <span className={getBadgeClassname(availability)}>
            {getBadgeText(availability, cardT)}
          </span>
          <span className="badge bg-light text-dark">
            {getLocationName(location, cityT)}
          </span>
        </p>
        <h4 className="card-title">{name}</h4>
        <h6 className="card-subtitle mb-2 text-muted">{address}</h6>
        <p className="card-text">{department}</p>
        <p className="card-text">{phone}</p>
        <a href={website} className="btn btn-primary">{buttonText}</a>
      </div>
    </div>
  );
}
