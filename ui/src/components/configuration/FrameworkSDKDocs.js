import React from 'react';
import { ListView } from 'patternfly-react';
import Header from './Header';
import { ServiceSDKDocs } from './ServiceSDKDocs';
import ServiceSDKInfo from './ServiceSDKInfo';

const FrameworkSDKDocs = ({ framework, mobileApp }) => {
  const status = mobileApp.getStatus();
  const { services = [] } = { services: status.getServices() };
  return (
    <ListView.Item
      id={`framework-${framework}`}
      heading={framework.title}
      leftContent={<img alt={framework.title} src={framework.icon} className="icon" />}
    >
      <Header>SDK Configuration</Header>
      <ServiceSDKDocs framework={framework} mobileApp={mobileApp} />

      <h4>Service specific documentation</h4>
      {services && services.length > 0 ? (
        <ServiceSDKInfo framework={framework} mobileApp={mobileApp} />
      ) : (
        <ul><li>There are no services bound to this client to show the documentation for.</li></ul>
      )}
    </ListView.Item>
  );
};

export default FrameworkSDKDocs;
