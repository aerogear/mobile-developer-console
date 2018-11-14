import QRCode from 'qrcode.react';
import React, { Component } from 'react';
import { Button, MessageDialog, Alert, Spinner } from 'patternfly-react';
import { connect } from 'react-redux';
import '../components/build/BuildDownload.css';
import { generateDownloadURL } from '../actions/builds';

const content = downloadURL => (
  <React.Fragment>
    <Alert type="info" className="build-alert">
      These links will remain active for 30 minutes and will not be usable after that time
    </Alert>
    <dl>
      <dt>Download from URL:</dt>
      <dd>
        <a href={downloadURL}>{downloadURL}</a>
      </dd>
      <br />
      <dt>or scan QR code to install:</dt>
      <dd className="build-qr-code">
        <QRCode value={downloadURL} size={200} />
      </dd>
    </dl>
  </React.Fragment>
);

const spinner = (
  <div className="build-spinner">
    <Spinner loading />
  </div>
);

class BuildDownload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false
    };
  }

  handleDownload = () => {
    if (!this.props.build.metadata.annotations['aerogear.org/download-mobile-artifact']) {
      this.props.generateDownloadURL(this.props.build.metadata.name);
    }
    this.setState({
      showModal: true
    });
  };

  handleDialogClose = () => {
    this.setState({
      showModal: false
    });
  };

  render() {
    let downloadURL = this.props.build.metadata.annotations['aerogear.org/download-mobile-artifact-url'] || '';
    downloadURL = downloadURL.replace('&amp;', ';');
    const buildConfigName = this.props.build.metadata.annotations['openshift.io/build-config.name'];
    return (
      <React.Fragment>
        <Button
          bsSize={this.props.history ? 'xsmall' : null}
          bsStyle={this.props.history ? 'default' : 'primary'}
          onClick={this.handleDownload}
          disabled={this.props.build.status.phase !== 'Complete'}
        >
          Generate Download Link
        </Button>
        <MessageDialog
          show={this.state.showModal}
          onHide={this.handleDialogClose}
          primaryAction={() => {}}
          primaryActionButtonContent="Close"
          footer={<React.Fragment />}
          title={`Download ${this.props.appName} (${buildConfigName})`}
          primaryContent={downloadURL !== '' ? content(downloadURL) : spinner}
          className="build-download-dialog"
        />
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = {
  generateDownloadURL
};

export default connect(
  null,
  mapDispatchToProps
)(BuildDownload);
