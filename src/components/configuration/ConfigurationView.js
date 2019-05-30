import { Row, Col, ListView } from 'patternfly-react';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { find } from 'lodash-es';
import Header from './Header';
import CopyToClipboardMultiline from '../common/CopyToClipboardMultiline';

import './ConfigurationView.css';
import FrameworkSDKDocs from './FrameworkSDKDocs';
import frameworks from './sdk-config-docs/frameworks';
import { fetchAppConfig } from '../../actions/apps';

class ConfigurationView extends Component {
  componentDidMount() {
    const { appName } = this.props;
    this.props.fetchAppConfig(appName);
    // for now we keep it simple by simply fetching the app config every 2 seconds.
    // we can consider adding websocket support in the future if it's actually needed.
    this.appConfigInterval = setInterval(() => this.props.fetchAppConfig(appName), 2000);
  }

  componentWillUnmount() {
    if (this.appConfigInterval) {
      clearInterval(this.appConfigInterval);
    }
  }

  getAppConfig(appName) {
    return find(this.props.appConfigs.items, item => item.clientId === appName) || {};
  }

  render() {
    const appConfig = this.getAppConfig(this.props.appName);
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
              {JSON.stringify(appConfig, null, 2)}
            </CopyToClipboardMultiline>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    docsPrefix: state.config.docsPrefix,
    appConfigs: state.appConfigs
  };
}

const mapDispatchToProps = {
  fetchAppConfig
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConfigurationView);
