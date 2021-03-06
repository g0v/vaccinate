/* eslint-disable jsx-a11y/control-has-associated-label */
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
  district: string,
  name: string,
  phone: string,
  website: Array<{ title: ?string, link: ?string }>,
  googleMap: string,
  lastModified: string,
}): React.Node {
  const {
    address,
    availability,
    buttonText,
    department,
    location,
    district,
    name,
    phone,
    website,
    googleMap,
    lastModified,
  } = props;
  const lastModifiedObject = new Date(lastModified);
  const [cardT] = useTranslation('card');
  const [cityT] = useTranslation('city');
  const lastModifiedString = `${cardT('txt-updateTime')}: ${lastModifiedObject.toLocaleDateString()} ${lastModifiedObject.toLocaleTimeString()}`;
  const reportLink = `https://airtable.com/shrytVXesuVlmfwcS?prefill_回報內容=回報錯誤連結&prefill_縣市=${location}&prefill_醫療院所名稱=${name}`;
  return (
    <div className="card">
      <div className="card-body d-flex flex-column">
        <div className="row">
          <div className="col-md-auto">
            <span className={getBadgeClassname(availability)}>
              {getBadgeText(availability, cardT)}
            </span>
            <span className="badge bg-dark text-light me-1 mb-1">
              {getLocationName(location, cityT)}
            </span>
            <span className="badge bg-dark text-light me-1 mb-1">{district}</span>
          </div>
          <div className="col-md-auto mb-1 text-sm" style={{ fontSize: '0.8rem' }}>
            <span>{lastModifiedString}</span>
          </div>
        </div>
        <h4 className="card-title">{name}</h4>
        <h6 className="card-subtitle mb-2 text-muted">
          {address}
          {googleMap !== null ? <a href={googleMap} target="_blank" rel="noreferrer" className="ms-2"><i className="fas fa-map-marked-alt" /></a> : null}
        </h6>
        <p className="card-text">{department}</p>
        <p className="card-text">{phone}</p>
        <div className="d-grid mt-auto card-buttons">
          {website[0].link !== null ? website.map((site) => (
            <a
              href={site.link}
              className="btn btn-primary mb-2"
              target="_blank"
              rel="noreferrer"
            >
              {site.title != null ? site.title : buttonText}
            </a>
          )) : null}
          <a href={`tel:${phone}`} className="btn btn-primary mb-2 d-md-none">
            {cardT('txt-telephone')}
          </a>
          <a
            href={reportLink}
            className="my-2"
            style={{ display: 'inline-block', textAlign: 'center', textDecoration: 'none' }}
            target="_blank"
            rel="noreferrer"
          >
            {cardT('txt-report')}
          </a>
        </div>
      </div>
    </div>
  );
}
