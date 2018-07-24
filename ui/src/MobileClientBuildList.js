import React, { Component } from 'react';
import { ListGroup, ListGroupItem, Icon, Row, Col } from 'patternfly-react';
import './styles/MobileClientBuild.css';

export class MobileClientBuildList extends Component {
    render = () => {
        const mobileClientBuilds = Object.values(this.props.mobileClientBuilds || {});
        return ( 
        <div className="text-left">
            <h6 className="list-group-heading">
                MOBILE BUILDS
            </h6>
            <ListGroup className="list-group-build">
                    {mobileClientBuilds.map(
                        ( mobileClientBuild, index ) => (
                        <ListGroupItem key={index}>
                            <Row>
                                <Col md={6} className="text-left list-group-build-item">
                                        <a href={mobileClientBuild.metadata.selfLink}>{mobileClientBuild.status.config.name} </a>
                                </Col>
                                <Col md={6} className="list-group-build-item-description">
                                <p className="build-info"> 
                                        {(mobileClientBuild.status.phase === "Running") ?
                                                <Icon type="fa" name="refresh" className="icon"/> : (mobileClientBuild.status.phase === "Failed") ?
                                                    <Icon type="pf" name="error-circle-o" className="icon"/> : <Icon type="pf" name="ok" className="icon"/> }
                                        {mobileClientBuild.kind} #{mobileClientBuild.metadata.annotations['openshift.io/build.number']} 
                                        {(mobileClientBuild.status.phase === "Running") ?
                                            " is running " : (mobileClientBuild.status.phase === "Failed") ? 
                                            " failed " : " is complete "}
                                </p>
                                <p className="timestamp">
                                            {this.convertTime(mobileClientBuild.status.startTimestamp)}
                                            </p>
                                </Col>
                            </Row>
                    </ListGroupItem>
                ))}
            </ListGroup>
        </div> 
        );
    }
    convertTime = (timeString) => {
        let date = new Date()
        let createdDate = new Date(timeString)
        let diff = date - createdDate;
        if (diff > 86400000 && diff < 86400000 * 2) {
            return ' created ' + Math.floor(diff / 86400000) + ' day ago'
        }
        else if (diff > 86400000) {
           return ' created ' + Math.floor(diff / 86400000) + ' days ago'
        }
        else if (diff > 3600000) {
            return ' created ' + Math.floor(diff / 3600000) + ' hours ago'
        }
        else if (diff > 60000) {
            return ' created ' + Math.floor(diff / 60000) + ' minutes ago'
        }
    }
}