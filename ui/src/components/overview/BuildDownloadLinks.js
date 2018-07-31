import React, { Component } from 'react';
import { Col} from 'patternfly-react';
import './BuildDownloadLinks.css';
import QRCode from 'qrcode.react';

class BuildDownloadLinks extends Component {

    render() {
        const size = this.props.QRSize || 256;
        return (
            <div className="build-download-component">
                <Col md={6}>
                    <p>Download from URL:</p>
                    <a>{this.props.downloadURL}</a>
                </Col>
                <Col md={6}>
                    <p>or Scan QR Code:</p>
                    <QRCode value={this.props.downloadURL} size={size}/>
                </Col>
            </div>
        )
    }
}

 export default BuildDownloadLinks;
