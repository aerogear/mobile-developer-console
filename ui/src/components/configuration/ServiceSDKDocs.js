import React from 'react';
import './ServiceSDKDocs.css';
import { ServiceSDKSetup } from './ServiceSDKSetup';

// TODO Cordova is hard-coded now, remove in future
const sdkConfigDocs = require('./sdk-config-docs/cordova.json');

export const ServiceSDKDocs = ({ mobileApp }) => {
  if (mobileApp) {
    const status = mobileApp.getStatus();
    const { services = [] } = { services: status.getServices() };
    return (
      <React.Fragment>
        <ol>
          <ServiceSDKSetup docs={sdkConfigDocs.sdkInit} />
          {services.map(({ type }) => (
            <ServiceSDKSetup key={type} docs={sdkConfigDocs.services[type]} />
          ))}
        </ol>
      </React.Fragment>
    );
  }
  return <React.Fragment />;
};
