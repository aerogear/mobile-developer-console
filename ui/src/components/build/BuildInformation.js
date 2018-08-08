import React, { Component } from 'react';
import { Button, Col } from 'patternfly-react';

import BuildDownloadLinks from './BuildDownloadLinks';
import BuildSummary from './BuildSummary';

import "./BuildInformation.css";

const downloadInfo = {
    "downloadUrl": "https://redhat.invisionapp.com/share/GRJJGUHNSET#/screens/295058246"
  }

class BuildInformation extends Component {
    constructor(props){
        super(props)
        this.state = {
            toggleLinks : false,
            buildSuccessfull : true
        }
    }

    handleDownload(){
        this.setState(prevState => ({
            toggleLinks: !prevState.toggleLinks
        }));
    }

    //TODO: Add a handler function to toggle download on complete pipeline
    renderDownloadButton(){
        if (this.state.buildSuccessfull){
            return <div className="build-download">
            <Button bsStyle="primary" onClick={this.handleDownload.bind(this)}>
                Download
            </Button>
        </div>
        }
        return null;
    }

    renderDownloadDialog(){
        if (this.state.toggleLinks){
            return <BuildDownloadLinks downloadInfo={downloadInfo}/>
        }
        return null;
    }

    render () {
        return (
            <div className="build-information">
                <div className="latest-mobile-build">
                    <Col className="latest-build-pipeline" md={10}>
                        <div className="build-pipeline">
                            <BuildSummary build={this.props.build}/>
                            <div className="pipeline-container">
                                <div className="pipeline">
                                
                                </div>
                            </div>
                        </div>
                    </Col>
                </div>
            </div>
        )
    }
}

export default BuildInformation;