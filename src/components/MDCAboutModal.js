import React from 'react';
import { connect } from 'react-redux';
import { AboutModal, TextContent, TextList, TextListItem } from '@patternfly/react-core';
import bowser from 'bowser';
import { fetchAndWatchServices } from '../actions/services';
import { getBackground, getBranding } from '../services/openshift';

export class MDCAboutModal extends React.Component {
  componentDidMount() {
    this.props.fetchAndWatchServices();
  }
  getMobileConsoleVersion() {
    const MDCService = this.props.items.find(item => item.name === 'Mobile Developer Console');
    if (MDCService) {
      return MDCService.version;
    }
    return '';
  }

  getVersion(vType) {
    const filteredService = this.props.items.find(item => item.type === vType);
    if (filteredService) {
      return filteredService.version;
    }
    return null;
  }

  render() {
    const browser = bowser.getParser(window.navigator.userAgent);
    const user = this.props.user;
    return (
      <AboutModal
        isOpen={this.props.isOpen}
        onClose={this.props.onClose}
        backgroundImageSrc={getBackground()}
        brandImageAlt="Mobile Developer Console logo"
        brandImageSrc={getBranding()}
        productName="Mobile Developer Console"
      >
        <TextContent>
          <TextList component="dl">
            {/* <TextListItem component="dt">Version</TextListItem>
            <TextListItem component="dt"> {this.getMobileConsoleVersion()}</TextListItem> */}
            <TextListItem component="dt">Identity Management Service</TextListItem>
            <TextListItem component="dd"> {this.getVersion('keycloak')}</TextListItem>
            <TextListItem component="dt">Unified Push Servier</TextListItem>
            <TextListItem component="dd"> {this.getVersion('push')}</TextListItem>
            <TextListItem component="dt">Mobile Metrics</TextListItem>
            <TextListItem component="dd"> {this.getVersion('security')}</TextListItem>
            {/* <TextListItem component="dt">Data Sync</TextListItem> 
            <TextListItem component="dd"> {this.getVersion('sync-app')}</TextListItem> */}
            <TextListItem component="dt">User Name</TextListItem>
            <TextListItem component="dd">{user ? user.name : ''}</TextListItem>
            <TextListItem component="dt">Browser Version</TextListItem>
            <TextListItem component="dd">{browser.getBrowserVersion()}</TextListItem>
            <TextListItem component="dt">Browser OS</TextListItem>
            <TextListItem component="dd">{browser.getBrowserName()}</TextListItem>
          </TextList>
        </TextContent>
      </AboutModal>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.services
  };
}

const mapDispatchToProps = {
  fetchAndWatchServices
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MDCAboutModal);
