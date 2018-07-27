import React, { Component } from 'react';
import { Alert } from 'patternfly-react'

let view = true;
class MobileClientNotification extends Component {
    // handler for alert dismiss button
    handleDismiss = () => {
        this.setState({})
        view = false;
    }
    
    // handle to see if an alert is needed
    handleAlert() {
        return (this.props.unBoundServices === 0 || !view) ? "" : 
        <Alert type="info" onDismiss={this.handleDismiss}>{this.props.unBoundServices} mobile services are not bound to this client. <a>Bind them to use with this client.</a></Alert>;
    }

    render = () => {
        return (
            this.handleAlert()
        )
    }
}

export default MobileClientNotification;