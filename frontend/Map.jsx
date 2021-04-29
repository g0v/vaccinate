// @flow
import * as React from 'react';

export default function Map(): React.Node {
  return (
    <div className="container" style={{ textAlign: 'center' }}>
      <iframe
        src="https://www.google.com/maps/d/embed?mid=1LUqWZfmEBZFCAl8ThcE1cakLsb9k-Pkr"
        width="640"
        height="480"
        title="Map"
      />
    </div>
  );
}
