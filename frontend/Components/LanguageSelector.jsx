import * as React from 'react';

export default function LanguageSelector(): React.Node {
  return <div style={{ textAlign: 'center' }}>
    <form
      className="btn-group"
      role="group"
      aria-label="Select type of vaccination."
    >
      {/* eslint-disable jsx-a11y/label-has-associated-control */}
      <input
        type="radio"
        className="btn-check"
        name="btnradio"
        id="btnradio1"
        autoComplete="off"
        onClick={() => setVaccineType('SelfPaid')}
        checked={vaccineType === 'SelfPaid'}
      />
      <label
        className="btn btn-outline-primary"
        htmlFor="btnradio1"
      >
        {strings.vaccineTypes.selfPaid[locale]}
      </label>
      <input
        type="radio"
        className="btn-check"
        name="btnradio"
        id="btnradio2"
        autoComplete="off"
        onClick={() => setVaccineType('GovernmentPaid')}
        checked={vaccineType === 'GovernmentPaid'}
      />
      <label
        className="btn btn-outline-primary"
        htmlFor="btnradio2"
      >
        {strings.vaccineTypes.governmentPaid[locale]}
      </label>
    </form>
  </div>;
}