import React, { Component } from 'react';
import Header from './Header';
import { ServiceSDKInfo } from './ServiceSDKInfo';
import { ServiceSDKDocs } from './ServiceSDKDocs';
import { CopyToClipboardMultiline } from '../common/CopyToClipboardMultiline';
import { Row, Col } from 'patternfly-react';

import './ConfigurationView.css';

// TODO remove mock values

const config = {
  version: 1,
  clusterName: 'https://192.168.0.106:8443',
  namespace: 'myproject',
  clientId: 'myapp-android',
  services: []
};

const serviceSDKInfo = [
  {
    serviceLogoUrl: 'https://pbs.twimg.com/profile_images/702119821979344897/oAC05cEB_400x400.png',
    serviceName: 'Identity Management',
    serviceId: 'dh-keycloak-apb-h7k9j',
    serviceDescription: 'Identity Management - Identity and Access Management',
    setupText: 'Identity Management SDK setup',
    docsLink: 'https://docs.aerogear.org/aerogear/latest/identity-management.html#setup'
  },
  {
    serviceLogoUrl: 'https://avatars1.githubusercontent.com/u/3380462?s=200&v=4',
    serviceName: 'Mobile Metrics',
    serviceId: 'dh-metrics-apb-wqm5c',
    serviceDescription: 'Installs a metrics service based on Prometheus and Grafana',
    setupText: 'Mobile Metrics SDK setups',
    docsLink: 'https://docs.aerogear.org/aerogear/latest/mobile-metrics.html#setup'
  }
];

class ConfigurationView extends Component {
  render() {
    const { status = {} } = this.props.app;
    const { services = [] } = status;
    config.services = services;
    return (
      <React.Fragment>
        <Row className="configurationView">
          <Col xs={6}>
            <Header>SDK Configuration</Header>
            <ServiceSDKDocs />

            <h4>Service specific configuration steps</h4>
            {serviceSDKInfo.map((info, index) => (
              <ServiceSDKInfo
                serviceLogoUrl={info.serviceLogoUrl}
                serviceName={info.serviceName}
                serviceId={info.serviceId}
                serviceDescription={info.serviceDescription}
                setupText={info.setupText}
                docsLink={info.docsLink}
                key={index}
              />
            ))}
          </Col>
          <Col xs={6}>
            <Header>mobile-services.json</Header>
            <CopyToClipboardMultiline className="mobile-client-config">
              {JSON.stringify(config, null, 2)}
            </CopyToClipboardMultiline>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

export default ConfigurationView;