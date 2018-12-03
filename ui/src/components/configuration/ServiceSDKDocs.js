import React from 'react';
import './ServiceSDKDocs.css';
import { ServiceSDKSetup } from './ServiceSDKSetup';

export const ServiceSDKDocs = ({ framework, mobileApp }) => {
  if (mobileApp) {
    const status = mobileApp.getStatus();
    const { services = [] } = { services: status.getServices() };
    return services ? (
      <ol>
        {framework.steps.map((docs, index) => (
          <ServiceSDKSetup docs={docs} key={`docs-${index}`} />
        ))}
        {services.map(({ type }, index) =>
          framework.services[type].steps.map(docs => <ServiceSDKSetup key={`sdk-setup-${index}`} docs={docs} />)
        )}
      </ol>
    ) : (
      <React.Fragment />
    );
  }
  return <React.Fragment />;
};
