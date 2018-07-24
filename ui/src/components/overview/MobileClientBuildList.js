import React, { Component } from 'react';
import { ListGroup, ListGroupItem, Col } from 'patternfly-react';
import Moment from 'react-moment';
import './MobileClientBuild.css';
import BuildStatus from '../common/BuildStatus';

class MobileClientBuildList extends Component {
    render = () => {
        const mobileClientBuilds = Object.values(this.props.mobileClientBuilds || {});
        return ( 
        <div>
            <ListGroup className="build-view-list-group">
                {mobileClientBuilds.map(
                    ( mobileClientBuild ) => {
                        let kind = mobileClientBuild.kind;
                        let buildNumber = mobileClientBuild.metadata.annotations['openshift.io/build.number'];
                        let name = mobileClientBuild.metadata.name;
                        return (
                            <ListGroupItem key={mobileClientBuild.metadata.uid}>
                                <Col md={6} className="build-name">
                                    <h3>
                                        <a href={mobileClientBuild.metadata.selfLink}>{name}</a>
                                    </h3>
                                </Col>
                                <Col md={6} className="build-details">
                                    <BuildStatus build={mobileClientBuild}></BuildStatus>
                                    <a href="">{kind} #{buildNumber}</a>
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