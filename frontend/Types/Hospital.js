// @flow
import type { Availability } from './Availability';
import type { Location } from './Location';
import type { VaccineType } from './VaccineType';

export type Hospital = {|
  address: string,
  department: string,
  governmentPaidAvailability: Availability,
  hospitalId: number,
  location: Location,
  district: string,
  name: string,
  phone: string,
  selfPaidAvailability: Availability,
  website: Array<{title: string | null, link: string | null}>,
  lastModified: string,
|};

export function getAvailability(
  hospital: Hospital,
  vaccineType: VaccineType,
): Availability {
  return vaccineType === 'SelfPaid'
    ? hospital.selfPaidAvailability
    : hospital.governmentPaidAvailability;
}
