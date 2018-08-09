import React, { Component } from 'react';
import Moment from "react-moment";
import BuildStatus from '../common/BuildStatus';

import "./BuildSummary.css";

class BuildSummary extends Component { 
    render () {
        return (
            <div className="build-summary-container">
                 <div className="build-phase">
                    <BuildStatus build={this.props.build} />
                    &nbsp;
                    <a>Build #{this.props.build.metadata.annotations['openshift.io/build.number']}</a>
                </div>
                 <div className="build-timestamp"><Moment fromNow>{this.props.build.status.startTimestamp}</Moment></div>
                 <div className="build-links"><a>View log</a></div>
            </div>
        )
    }
}

export default BuildSummary;