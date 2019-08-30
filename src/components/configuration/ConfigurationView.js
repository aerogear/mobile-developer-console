import { Row, Col, ListView } from 'patternfly-react';
import { ClipboardCopy, ClipboardCopyVariant } from '@patternfly/react-core';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Header from './Header';

import './ConfigurationView.css';
import FrameworkSDKDocs from './FrameworkSDKDocs';
import frameworks from './sdk-config-docs/frameworks';

class ConfigurationView extends Component {
  render() {
    console.log("WHAT IS THIS", this.props.docsPrefix)
    const { status } = this.props.app;
    return (
      <React.Fragment>
        <Row className="configurationView">
          <Col xs={6}>
            <ListView>
              {Object.keys(frameworks).map(key => (
                <FrameworkSDKDocs
                  key={key}
                  framework={frameworks[key](this.props.docsPrefix)}
                  mobileApp={this.props.app}
                />
              ))}
            </ListView>
          </Col>
          <Col xs={6}>
            <Header>mobile-services.json</Header>
            <ClipboardCopy isReadOnly variant={ClipboardCopyVariant.expansion} className="mobile-client-config">
              {JSON.stringify(status, null, 2)}
            </ClipboardCopy>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    docsPrefix: state.config.docsPrefix
  };
}

export default connect(mapStateToProps)(ConfigurationView);
