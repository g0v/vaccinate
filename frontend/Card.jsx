// @flow
import * as React from 'react';
import type { Availability } from './Availability';
import type { Locale } from './Locale';
import type { Location } from './Location';
import strings from './Card.json';

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

function getBadgeText(availability: Availability, locale: Locale): string {
  switch (availability) {
    case 'Available':
      return strings.availability.available[locale];
    case 'Unavailable':
      return strings.availability.unavailable[locale];
    case 'No Data':
      return strings.availability.noData[locale];
    default:
      return strings.availability.noData[locale];
  }
}

function getLocationName(location: Location, locale: Locale): string {
  switch (location) {
    case '基隆市':
      return strings.locations.keelung[locale];
    case '臺北市':
      return strings.locations.taipei[locale];
    case '新北市':
      return strings.locations.newTaipeiCity[locale];
    case '新竹縣':
      return strings.locations.hsinchuCounty[locale];
    case '新竹市':
      return strings.locations.hsinchuCity[locale];
    case '彰化縣':
      return strings.locations.changhua[locale];
    case '苗栗縣':
      return strings.locations.miaoli[locale];
    case '桃園市':
      return strings.locations.taoyuan[locale];
    case '宜蘭縣':
      return strings.locations.yilan[locale];
    case '臺中市':
      return strings.locations.taichung[locale];
    case '雲林縣':
      return strings.locations.yunlin[locale];
    case '南投縣':
      return strings.locations.nantou[locale];
    case '嘉義縣':
      return strings.locations.chiayi[locale];
    case '台南市':
      return strings.locations.tainan[locale];
    case '高雄市':
      return strings.locations.kaohsiung[locale];
    case '屏東縣':
      return strings.locations.pingtung[locale];
    case '花蓮縣':
      return strings.locations.hualien[locale];
    case '連江縣':
      return strings.locations.lienjiang[locale];
    case '澎湖縣':
      return strings.locations.penghu[locale];
    case '臺東縣':
      return strings.locations.taitung[locale];
    case '金門縣':
      return strings.locations.kinmen[locale];
    default:
      return location;
  }
}

export default function Card(props: {
  address: string,
  availability: Availability,
  buttonText: string,
  department: string,
  locale: Locale,
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
    locale,
    location,
    name,
    phone,
    website,
  } = props;
  return (
    <div className="card">
      <div className="card-body">
        <p className="card-text">
          <span className={getBadgeClassname(availability)}>
            {getBadgeText(availability, locale)}
          </span>
          <span className="badge bg-light text-dark">
            {getLocationName(location, locale)}
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
