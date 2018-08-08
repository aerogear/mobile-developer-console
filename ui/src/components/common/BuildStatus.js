import React, { Component } from 'react';
import './BuildStatus.css';

const getIcon = phase => {
    switch(phase) {
        case 'Complete':
            return <span className="fa fa-check-circle fa-fw" aria-hidden="true"></span>;
        case 'Failed':
            return <span className="fa fa-times-circle fa-fw" aria-hidden="true"></span>;
        case 'Cancelled':
            return <span className="fa fa-ban text-muted fa-fw" aria-hidden="true"></span>;
        case 'Completed':
            return <span className="fa fa-check text-success fa-fw" aria-hidden="true"></span>;
        case 'Active':
            return <span className="fa fa-refresh fa-fw" aria-hidden="true"></span>;
        case 'Error':
            return <span className="fa fa-times text-danger fa-fw" aria-hidden="true"></span>;
        case 'New':
            return <span className="fa fa-hourglass-o fa-fw" aria-hidden="true"></span>;
        case 'Pending':
            return <span className="fa fa-hourglass-half fa-fw" aria-hidden="true"></span>;
        case 'Ready':
            return <span className="fa fa-check text-success fa-fw" aria-hidden="true"></span>;
        case 'Running':
            return <span className="fa fa-refresh fa-spin fa-fw" aria-hidden="true"></span>;
        case 'Succeeded':
            return <span className="fa fa-check text-success fa-fw" aria-hidden="true"></span>;
        default:
            return null;
    }
};

class BuildStatus extends Component {
    render = () => {
        const {phase} = this.props.build.status;
        return (
            <React.Fragment>
                {getIcon(phase)}
            </React.Fragment>
        );
    }
}

export default BuildStatus;
