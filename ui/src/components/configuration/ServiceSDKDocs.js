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
        {services.map(({ type }, index) => {
          if (framework.services[type]) {
            return framework.services[type].steps.map(docs => (
              <ServiceSDKSetup key={`sdk-setup-${index}`} docs={docs} />
            ));
          }
          console.error(`Bad service type found '${type}'`);
          return null;
        })}
      </ol>
    ) : (
      <React.Fragment />
    );
  }
  return <React.Fragment />;
};
