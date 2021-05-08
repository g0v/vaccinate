// @flow
import * as React from 'react';
// $FlowIgnore[cannot-resolve-module] This is how ParcelJS imports assets
import favicon from 'url:../assets/g0v.png'; // eslint-disable-line

import type { Locale } from './Locale';


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

function G0vbar(props: { locale: Locale }): React.Node {
  const { locale } = props;
  const g0vbarContent = {
    color: 'white',
    fontSize: '12px',
    paddingTop: '5px',
    paddingBottom: '5px',
    textAlign: 'left',
  };

  const barContent: { [Locale]: React.Node} = {
    'en': (
      <>
        This is a website by&nbsp;
        <a style={g0vbarLinkStyle} href="https://hack.g0v.tw">g0v, Taiwan's Civic Tech Network</a>.
      </>
    ),
    'zh': (
      <>
        這是一個
        <a style={g0vbarLinkStyle} href="https://hack.g0v.tw">台灣g0v公民科技社群</a>
        開發的網站。
      </>
    )
  };
  console.log(barContent[locale]);
  return (
    <div className="g0vbar" style={g0vbar} >
      <div className="container" style={g0vbarContent}>
        <img
          alt="icon for gov-zero civic tech network"
          src={favicon}
          style={g0vbarImg}
        />
        {barContent[locale]}
      </div>
    </div >
  );
}

export default G0vbar;
