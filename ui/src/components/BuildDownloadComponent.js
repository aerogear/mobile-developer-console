import React, { Component } from 'react';
import { Alert, Col} from 'patternfly-react';
import '../style/BuildDownloadComponent.css';
import QRCode from '../assets/QRCode.png'

class BuildDownloadComponent extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="build-download-component">
                <Col md={12}>
                    <Alert type="info">These links will remain active for 24 minutes and will not be usable after that time</Alert>
                </Col>
                <Col md={5}>
                    <p>Download from URL:</p>
                    <a>{this.props.downloadURL}</a>
                </Col>
                <Col md={7}>
                    <span>or Scan QR Code:</span>
                    <img src={QRCode} alt="QR Code"/>
                </Col>
            </div>
       )
    }
}

export default BuildDownloadComponent;
