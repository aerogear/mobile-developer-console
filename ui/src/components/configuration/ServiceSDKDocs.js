import React from 'react';
import './ServiceSDKDocs.css';
import { ServiceSDKSetup } from './ServiceSDKSetup';

export const ServiceSDKDocs = ({ framework, mobileApp }) => {
  if (mobileApp) {
    const status = mobileApp.getStatus();
    const { services = [] } = { services: status.getServices() };
    return services ? (
      <React.Fragment>
        <ol>
          {framework.steps.map(docs => (
            <ServiceSDKSetup docs={docs} />
          ))}
          {services.map(({ type }) =>
            framework.services[type].steps.map(docs => <ServiceSDKSetup key={type} docs={docs} />)
          )}
        </ol>
      </React.Fragment>
    ) : (
      <React.Fragment />
    );
  }
  return <React.Fragment />;
};
