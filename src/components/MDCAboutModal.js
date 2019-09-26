import React from 'react';
import {
  AboutModal,
  TextContent,
  TextList,
  TextListItem
} from '@patternfly/react-core';
import bowser from 'bowser';

export default class MDCAboutModal extends React.Component {

  render() {
    const browser = bowser.getParser(window.navigator.userAgent);
    return (
      <AboutModal
        isOpen={this.props.isOpen}
        onClose={this.props.onClose}
        backgroundImageSrc="/img/redhat-bg.svg"
        brandImageAlt="Red Hat logo"
        brandImageSrc="/img/redhat-logo.svg"
        productName="Mobile Developer Console">
        <TextContent>
          <TextList component="dl">
              <TextListItem component="dt">Console Version</TextListItem>
              <TextListItem component="dd"> </TextListItem>
              <TextListItem component="dt">Identity Management Service</TextListItem>
              <TextListItem component="dd"> </TextListItem>
              <TextListItem component="dt">Mobile Security Service</TextListItem>
              <TextListItem component="dd"> </TextListItem>
              <TextListItem component="dt">Push Service</TextListItem>
              <TextListItem component="dd"> </TextListItem>
              <TextListItem component="dt">User Name</TextListItem>
              <TextListItem component="dd">{this.props.user.name}</TextListItem>
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

