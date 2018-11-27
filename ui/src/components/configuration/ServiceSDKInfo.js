import React from 'react';
import { Col } from 'patternfly-react';

import './ServiceSDKInfo.css';

// TODO Cordova is hard-coded now, remove in future
const sdkConfigDocs = require('./sdk-config-docs/cordova.json');

export const ServiceSDKInfo = ({ mobileApp }) => {
  if (mobileApp) {
    const status = mobileApp.getStatus();
    const { services = [] } = { services: status.getServices() };
    return services ? (
      <React.Fragment>
        {services.map(({ type }) => {
          const { serviceLogoUrl, serviceName, setupText, docsLink } = sdkConfigDocs.services[type];
          return (
            <Col md={6} className="service-sdk-info">
              <Col md={12}>
                <img src={serviceLogoUrl} alt="" />
                <div className="service-name">
                  <h4>
                    <div>{serviceName}</div>
                  </h4>
                </div>
              </Col>
              <Col md={12}>
                <div className="service-details">
                  <h5>
                    <a href={docsLink} target="_blank" rel="noopener noreferrer">
                      {setupText}
                    </a>
                  </h5>
                </div>
              </Col>
            </Col>
          );
        })}
      </React.Fragment>
    ) : (
      <React.Fragment />
    );
  }
  return <React.Fragment />;
};

export default ServiceSDKInfo;
