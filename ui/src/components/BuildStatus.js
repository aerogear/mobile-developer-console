import React, { Component } from 'react';

const getIcon = phase => {
    switch(phase) {
        case 'Complete':
            return <i className="fa fa-check-circle fa-fw" aria-hidden="true"></i>;
        case 'Failed':
            return <i className="fa fa-check-circle fa-fw" aria-hidden="true"></i>;
        case 'Cancelled':
            return <span className="fa fa-ban text-muted" aria-hidden="true"></span>;
        case 'Completed':
            return <span className="fa fa-check text-success" aria-hidden="true"></span>;
        case 'Active':
            return <span className="fa fa-refresh" aria-hidden="true"></span>;
        case 'Error':
            return <span className="fa fa-times text-danger" aria-hidden="true"></span>;
        case 'New':
            return <span className="fa fa-hourglass-o" aria-hidden="true"></span>;
        case 'Pending':
            return <span className="fa fa-hourglass-half" aria-hidden="true"></span>;
        case 'Ready':
            return <span className="fa fa-check text-success" aria-hidden="true"></span>;
        case 'Running':
            return <span className="fa fa-refresh fa-spin" aria-hidden="true" ng-class="{'fa-spin' : spinning}"></span>;
        case 'Succeeded':
            return <span className="fa fa-check text-success" aria-hidden="true"></span>;
        default:
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