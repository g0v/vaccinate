// @flow
import * as React from 'react';

export default function Map(): React.Node {
  return (
    <div className='d-none d-md-block' style={{ textAlign: 'center' }}>
      <iframe
        src="https://www.google.com/maps/d/embed?mid=1LUqWZfmEBZFCAl8ThcE1cakLsb9k-Pkr"
        title="Map"
        style={{width: '100%', height: 500}}
      />
    </div>
  );
}
