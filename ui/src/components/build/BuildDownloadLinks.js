import React, { Component } from 'react';
import { Col, Row } from 'patternfly-react';
import './BuildDownloadLinks.css';
import QRCode from 'qrcode.react';

class BuildDownloadLinks extends Component {
    render() {
        const {downloadUrl} = this.props.downloadInfo;
        const size = this.props.QRSize || 256;

        return (
            <div className="build-download-component">
              <Row>
                <Col md={6}>
                    <p>Download from URL:</p>
                    <a>{downloadUrl}</a>
                </Col>
                <Col md={6}>
                    <p>or Scan QR Code:</p>
                    <QRCode value={downloadUrl} size={size}/>
                </Col>
              </Row>
            </div>
        )
    }
}

 export default BuildDownloadLinks;
