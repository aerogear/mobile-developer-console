import React, { Component } from 'react';
import { Col, Row } from 'patternfly-react';
import './BuildDownloadLinks.css';
import QRCode from 'qrcode.react';

class BuildDownloadLinks extends Component {
  render() {
    return (
      <div className="build-download-component">
        <Row>
          <Col md={5}>
            <p>Download from URL:</p>
            <a>{this.props.downloadURL}</a>
          </Col>
          <Col md={2}>
            <p className="float-right">or Scan QR Code:</p>
          </Col>
          <Col md={4}>
            <QRCode value={this.props.downloadURL} size={200} />
          </Col>
        </Row>
      </div>
    );
  }
}

export default BuildDownloadLinks;
