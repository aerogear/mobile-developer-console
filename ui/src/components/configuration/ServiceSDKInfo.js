import React from 'react';
import { Col } from 'patternfly-react';

import './ServiceSDKInfo.css';

export const ServiceSDKInfo = ({ framework, mobileApp }) => {
  if (mobileApp) {
    const status = mobileApp.getStatus();
    const { services = [] } = { services: status.getServices() };
    return services ? (
      <React.Fragment>
        {services.map(({ type }) => {
          if (framework.services[type]) {
            const { serviceLogoUrl, serviceName, setupText, docsLink } = framework.services[type];
            return (
              <Col md={6} className="service-sdk-info" key={`sdk-info-${serviceName}`}>
                <Col md={12}>
                  <img src={serviceLogoUrl} alt="" />
                  <div className="service-name">
                    <h4>
                      <div>{serviceName}</div>
                    </h4>
                  </div>
                </Col>
                <Col md={12}>
                  <div className="service-details" key={`sdk-details-${serviceName}`}>
                    <h5>
                      <a href={docsLink} target="_blank" rel="noopener noreferrer">
                        {setupText}
                      </a>
                    </h5>
                  </div>
                </Col>
              </Col>
            );
          }
          console.error(`Bad service type found '${type}'`);
          return null;
        })}
      </React.Fragment>
    ) : (
      <React.Fragment />
    );
  }
  return <React.Fragment />;
};

export default ServiceSDKInfo;
