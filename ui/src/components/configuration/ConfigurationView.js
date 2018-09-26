import React, { Component } from 'react';
import { Grid, Row, Col } from 'patternfly-react';
import Header from './Header';
import ServiceSDKInfo from './ServiceSDKInfo';
import InlineEdit from './InlineEdit';
import CopyToClipboardMultiline from '../common/CopyToClipboardMultiline';

import './ConfigurationView.css';

const config = `{
  "version": 1,
  "clusterName": "https://192.168.0.106:8443",
  "namespace": "myproject",
  "clientId": "myapp-android",
  "services": []
}`;

const serviceSDKInfo = [
  {
    serviceLogoUrl: 'https://pbs.twimg.com/profile_images/702119821979344897/oAC05cEB_400x400.png',
    serviceName: 'Identity Management',
    serviceId: 'dh-keycloak-apb-h7k9j',
    serviceDescription: 'Identity Management - Identity and Access Management',
    setupText: 'Identity Management SDK setup'
  },
  {
    serviceLogoUrl: 'https://avatars1.githubusercontent.com/u/3380462?s=200&v=4',
    serviceName: 'Mobile Metrics',
    serviceId: 'dh-metrics-apb-wqm5c',
    serviceDescription: 'Installs a metrics service based on Prometheus and Grafana',
    setupText: 'Mobile Metrics SDK setups'
  }
];

class ConfigurationView extends Component {
  render() {
    return (
      <Grid fluid>
        <Row>
          <Col md={6}>
            <Header>Mobile Client Details</Header>
            <dl className="dl-horizontal left">
              <dt>Client Type:</dt>
              <dd>android</dd>
              <dt>Client ID:</dt>
              <dd>com.aerogear.androidshowcase</dd>
              <dt>Client API Key:</dt>
              <dd>b331aa8c-6c39-5f07-81f8-9eccf7fd6702</dd>
              <dt>DMZ Url:</dt>
              <dd>
                <InlineEdit placeholder="Set DMZ Url" noHorizontalPadding />
              </dd>
            </dl>
          </Col>
          <Col md={6}>
            <Header>Mobile Client Config</Header>
            <CopyToClipboardMultiline className="mobile-client-config">{config}</CopyToClipboardMultiline>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <Header>SDK Configuration</Header>
            <h4>
              <a>Android SDK Setup</a>
            </h4>
          </Col>
          <Col md={12} className="service-configuration">
            <Header className="service-configuration-header">Service Configuration</Header>
            {serviceSDKInfo.map((info, index) => (
              <ServiceSDKInfo
                serviceLogoUrl={info.serviceLogoUrl}
                serviceName={info.serviceName}
                serviceId={info.serviceId}
                serviceDescription={info.serviceDescription}
                setupText={info.setupText}
                key={index}
              />
            ))}
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default ConfigurationView;
