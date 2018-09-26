import React, { Component } from 'react';
import './BuildStatus.css';

const getIcon = phase => {
  switch (phase) {
    case 'Complete':
      return <span className="fa fa-check-circle fa-fw" aria-hidden="true" />;
    case 'Failed':
      return <span className="fa fa-times-circle fa-fw" aria-hidden="true" />;
    case 'Cancelled':
      return <span className="fa fa-ban text-muted fa-fw" aria-hidden="true" />;
    case 'Completed':
      return <span className="fa fa-check text-success fa-fw" aria-hidden="true" />;
    case 'Active':
      return <span className="fa fa-refresh fa-fw" aria-hidden="true" />;
    case 'Error':
      return <span className="fa fa-times text-danger fa-fw" aria-hidden="true" />;
    case 'New':
      return <span className="fa fa-hourglass-o fa-fw" aria-hidden="true" />;
    case 'Pending':
      return <span className="fa fa-hourglass-half fa-fw" aria-hidden="true" />;
    case 'Ready':
      return <span className="fa fa-check text-success fa-fw" aria-hidden="true" />;
    case 'Running':
      return <span className="fa fa-refresh fa-spin fa-fw" aria-hidden="true" />;
    case 'Succeeded':
      return <span className="fa fa-check text-success fa-fw" aria-hidden="true" />;
    default:
      return null;
  }
};

class BuildStatus extends Component {
  render = () => {
    const { phase } = this.props.build.status;
    return <React.Fragment>{getIcon(phase)}</React.Fragment>;
  };
}

export default BuildStatus;
