import React, { Component } from 'react';
import CopyToClipboardMultiline from './CopyToClipboardMultiline';

const createClientConfig = mobileClient => {
  const { status = {} } = mobileClient;
  status.services = status.services || [];
  return JSON.stringify(status, null, '  ');
};

class MobileClientConfig extends Component {
  render() {
    const { mobileClient = {} } = this.props;
    const config = createClientConfig(mobileClient);

    return (
      <React.Fragment>
        <CopyToClipboardMultiline className="mobile-client-config">{config}</CopyToClipboardMultiline>
      </React.Fragment>
    );
  }
}

export default MobileClientConfig;
