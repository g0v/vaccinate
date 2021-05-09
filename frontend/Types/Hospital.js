// @flow
import type { Availability } from './Availability';
import type { Location } from './Location';

export type Hospital = {|
    hospitalId: Number,
    name: string,
    location: Location,
    department: string,
    phone: string,
    address: string,
    website: string,
    availability: Availability,
  |};
