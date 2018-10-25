import React, { Component } from 'react';
import CopyToClipboardMultiline from './CopyToClipboardMultiline';

import './MobileClientConfig.css';

const createClientConfig = mobileClient => {
  const { status = {} } = mobileClient;
  status.services = status.services || [];
  return JSON.stringify(status, null, '  ');
};

export const MobileClientConfig = ({ mobileClient }) => (
  <CopyToClipboardMultiline className="mobile-client-config">
    {createClientConfig(mobileClient)}
  </CopyToClipboardMultiline>
);

export default MobileClientConfig;
