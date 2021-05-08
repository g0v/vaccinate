// @flow
import * as React from 'react';
// $FlowIgnore[cannot-resolve-module] This is how ParcelJS imports assets
import favicon from 'url:../assets/g0v.png'; // eslint-disable-line

const g0vbar = {
  background: '#343A40',
};

const g0vbarLinkStyle = {
  textDecoration: 'underline',
  color: 'white',
};

const g0vbarImg = {
  marginRight: '10px',
};

function G0vbar(): React.Node {
  const g0vbarContent = {
    color: 'white',
    fontSize: '12px',
    paddingTop: '5px',
    paddingBottom: '5px',
    textAlign: 'left',
  };
  return (
    <div className="g0vbar" style={g0vbar}>
      <div className="container">
        <img
          alt="icon for gov-zero civic tech network"
          src={favicon}
          style={g0vbarImg}
        />
          這是一個
          <a style={g0vbarLinkStyle} href="https://hack.g0v.tw">台灣g0v公民科技社群</a>
          開發的網站。
        </div>
    </div>
  );
}

export default G0vbar;
