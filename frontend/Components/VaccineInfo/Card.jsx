// @flow
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { getLocationName } from '../../Types/Location';
import type { Availability } from '../../Types/Availability';
import type { Location } from '../../Types/Location';

function getBadgeClassname(availability: Availability): string {
  switch (availability) {
    case 'Available':
      return 'badge bg-success me-1 d-none';
    case 'Unavailable':
      return 'badge bg-danger me-1 d-none';
    default:
      return 'badge bg-light text-dark me-1 d-none';
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

export default function Card(props: {
  address: string,
  availability: Availability,
  buttonText: string,
  department: string,
  location: Location,
  county: string,
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
    county,
    name,
    phone,
    website,
  } = props;

  const [cardT] = useTranslation('card');
  const [cityT] = useTranslation('city');
  return (
    <div className="card">
      <div className="card-body d-flex flex-column">
        <p className="card-text">
          <span className={getBadgeClassname(availability)}>
            {getBadgeText(availability, cardT)}
          </span>
          <span className="badge bg-dark text-light me-1">
            {getLocationName(location, cityT)}
          </span>
          <span className="badge bg-dark text-light me-1">
            {county}
          </span>
        </p>
        <h4 className="card-title">{name}</h4>
        <h6 className="card-subtitle mb-2 text-muted">{address}</h6>
        <p className="card-text">{department}</p>
        <p className="card-text">{phone}</p>
        <div className="d-grid mt-auto">
          <a href={website} className="btn btn-primary mb-1" target="_blank" rel="noreferrer">{buttonText}</a>
          <a href={`tel:${phone}`} className="btn btn-primary mb-1 d-md-none">電話預約</a>
        </div>
      </div>
    </div>
  );
}
