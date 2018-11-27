import React from 'react';
import { ListView } from 'patternfly-react';
import Header from './Header';
import { ServiceSDKDocs } from './ServiceSDKDocs';
import ServiceSDKInfo from './ServiceSDKInfo';

const FrameworkSDKDocs = ({ framework, mobileApp }) => (
  <ListView.Item
    id={`framework-${framework}`}
    heading={framework.title}
    leftContent={<img alt={framework.title} src={framework.icon} className="icon"/>}
  >
    <Header>SDK Configuration</Header>
    <ServiceSDKDocs mobileApp={mobileApp} />

    <h4>Service specific documentation</h4>
    <ServiceSDKInfo mobileApp={mobileApp} />
  </ListView.Item>
);

export default FrameworkSDKDocs;
