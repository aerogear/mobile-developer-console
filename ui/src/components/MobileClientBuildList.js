import React, { Component } from 'react';
import { ListGroup, ListGroupItem, Icon, Row, Col } from 'patternfly-react';
import Moment from 'react-moment';
import './MobileClientBuild.css';

class MobileClientBuildList extends Component {
    render = () => {
        const mobileClientBuilds = Object.values(this.props.mobileClientBuilds || {});
        return ( 
        <div className="text-left">
                <ListGroup className="build-view-list-group">
                    {mobileClientBuilds.map(
                        ( mobileClientBuild ) => {
                        let buildPhase = mobileClientBuild.status.phase;
                        let kind = mobileClientBuild.kind;
                        let buildNumber = mobileClientBuild.metadata.annotations['openshift.io/build.number'];
                        let name = mobileClientBuild.status.config.name;
                        return (
                            <ListGroupItem className="build-view-list-group-item" key={mobileClientBuild.metadata.uid}>
                                    <Col md={6}>
                                    <h3>
                                        <a href={mobileClientBuild.metadata.selfLink}>{name}</a>
                                    </h3>
                                    </Col>
                                <Col md={6}>
                                    <span className="build-info"> 
                                                {(buildPhase === "Running") ?
                                                        <Icon type="fa" name="refresh" className="build-view-status-icon"/> : (buildPhase === "Failed") ?
                                                            <Icon type="pf" name="error-circle-o" className="build-view-status-icon"/> : 
                                                                <Icon type="pf" name="ok" className="build-view-status-icon"/> }
                                                {(buildPhase === "Running") ?
                                                    " is running " : (buildPhase === "Failed") ? 
                                                    " failed " : " is complete "}
                                    </span>
                                    <a href="">{kind} #{buildNumber} </a>
                                    <span className="build-info timestamp">
                                            created <Moment fromNow>{mobileClientBuild.status.startTimestamp}</Moment>
                                    </span>
                                    </Col>
                        </ListGroupItem>
                    )})}
            </ListGroup>
        </div> 
        );
    }
}

export default MobileClientBuildList;