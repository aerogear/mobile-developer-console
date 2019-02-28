import { Row, Col, ListView } from 'patternfly-react';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Header from './Header';
import CopyToClipboardMultiline from '../common/CopyToClipboardMultiline';

import './ConfigurationView.css';
import FrameworkSDKDocs from './FrameworkSDKDocs';
import frameworks from './sdk-config-docs/frameworks';

class ConfigurationView extends Component {
  render() {
    const { status = {} } = this.props.app;
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
            <CopyToClipboardMultiline className="mobile-client-config">
              {JSON.stringify(status, null, 2)}
            </CopyToClipboardMultiline>
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
