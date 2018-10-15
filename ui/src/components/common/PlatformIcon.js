import React from 'react';

import './PlatformIcon.css';

const PlatformIcon = ({ platform, small }) => {
  let icon;
  switch (platform) {
    case 'android':
      icon = <span alt="Android" className="fa fa-android" />;
      break;
    case 'cordova':
      icon = <img alt="Cordova" src="/img/cordova.png" />;
      break;
    case 'iOS':
      icon = <span alt="iOS" className="fa fa-apple" />;
      break;
    case 'xamarin':
      icon = <img alt="Xamarin" src="/img/xamarin.svg" />;
      break;
    default:
      break;
  }
  return <span className={`platform-icon ${small ? 'platform-icon-small' : ''}`}>{icon}</span>;
};

export default PlatformIcon;
