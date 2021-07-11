// @flow
import type { Availability } from './Availability';
import type { Location } from './Location';
import type { VaccineType } from './VaccineType';

export type Hospital = {
    address: string,
    department: string,
    governmentPaidAvailability: Availability,
    hospitalId: number,
    location: Location,
    county: string,
    name: string,
    phone: string,
    selfPaidAvailability: Availability,
    website: string,
  };

export function getAvailability(hospital: Hospital, vaccineType: VaccineType): Availability {
  return vaccineType === 'SelfPaid'
    ? hospital.selfPaidAvailability : hospital.governmentPaidAvailability;
}
