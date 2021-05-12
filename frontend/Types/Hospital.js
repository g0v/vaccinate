// @flow
import type { Availability } from './Availability';
import type { Location } from './Location';

export type Hospital = {|
    address: string,
    department: string,
    governmentPaidAvailability: Availability,
    hospitalId: Number,
    location: Location,
    name: string,
    phone: string,
    selfPaidAvailability: Availability,
    website: string,
  |};
