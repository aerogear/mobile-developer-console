import React, { Component } from 'react';
import { ListGroup, ListGroupItem, Icon, Row, Col } from 'patternfly-react';
import Moment from 'react-moment';
import './styles/MobileClientBuild.css';

export class MobileClientBuildList extends Component {
    render = () => {
        const mobileClientBuilds = Object.values(this.props.mobileClientBuilds || {});
        return ( 
        <div className="text-left">
            <h6 className="build-view-header">
                MOBILE BUILDS
            </h6>
                <ListGroup className="build-view-list-group">
                    {mobileClientBuilds.map(
                        ( mobileClientBuild ) => {
                        let buildPhase = mobileClientBuild.status.phase;
                        let kind = mobileClientBuild.kind;
                        let buildNumber = mobileClientBuild.metadata.annotations['openshift.io/build.number'];
                        let name = mobileClientBuild.status.config.name;
                        return (
                            <ListGroupItem className="build-view-list-group-item" key={mobileClientBuild.metadata.uid}>
                                <Row>
                                    <Col md={6} className="text-left build-view-list-group-item">
                                            <a href={mobileClientBuild.metadata.selfLink}>{name}</a>
                                    </Col>
                                    <Col md={6} className="build-view-list-group-item-description">
                                    <p className="build-view-build-info"> 
                                            {(buildPhase === "Running") ?
                                                    <Icon type="fa" name="refresh" className="build-view-status-icon"/> : (buildPhase === "Failed") ?
                                                        <Icon type="pf" name="error-circle-o" className="build-view-status-icon"/> : 
                                                            <Icon type="pf" name="ok" className="build-view-status-icon"/> }
                                            {kind} #{buildNumber} 
                                            {(buildPhase === "Running") ?
                                                " is running " : (buildPhase === "Failed") ? 
                                                " failed " : " is complete "}
                                    </p>
                                    <p className="build-view-build-timestamp">
                                        created <Moment fromNow>{mobileClientBuild.status.startTimestamp}</Moment>
                                    </p>
                                    </Col>
                                </Row>
                        </ListGroupItem>
                    )})}
            </ListGroup>
        </div> 
        );
    }
}