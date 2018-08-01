import React, { Component } from 'react';
import { ListGroup, ListGroupItem, Col, Button } from 'patternfly-react';
import Moment from 'react-moment';
import './MobileClientBuildHistoryList.css';
import BuildStatus from '../common/BuildStatus';

const secondsInDay = 86400;
const secondsInHour = 3600;
const secondsInMinute = 60;

class MobileClientBuildHistoryList extends Component {

    getDurationString(duration) {
        if (typeof duration !== 'number') {
            return "";
        } else {
            const days = this.getDays(duration);
            const hours = this.getHours(duration);
            const minutes = this.getMinutes(duration);
            const seconds = this.getSeconds(duration);
            if (duration < 60) {
                return seconds + " seconds";
            } else if (duration < 3600) {
                return minutes + " minutes "+ seconds + " seconds";
            } else if (duration < 86400) {
                return hours + " hours " + minutes + " minutes "+ seconds + " seconds";
            } else {
                return days + " days " + hours + " hours " + minutes + " minutes " + seconds + " seconds";
            }
        }
        
    }

    getDays(duration) {
        return Math.floor(duration / secondsInDay);
    }

    getHours(duration) {
        return Math.floor((duration - this.getDays(duration) * secondsInDay) / secondsInHour);
    }

    getMinutes(duration) {
        return Math.floor((duration - this.getDays(duration) * secondsInDay - this.getHours(duration) * secondsInHour)/secondsInMinute);
    }

    getSeconds(duration) {
        return duration % secondsInMinute;
    }

    render = () => {
        const mobileClientBuilds = Object.values(this.props.mobileClientBuilds || {});
        return (
            <ListGroup>
                {mobileClientBuilds.map(
                    ( mobileClientBuild, i ) => {
                        const phase = mobileClientBuild.status.phase;
                        const buildNumber = mobileClientBuild.metadata.annotations['openshift.io/build.number'];
                        const durationSeconds = Math.abs(Math.round(new Date(mobileClientBuild.status.completionTimestamp).getTime()/1000) 
                        - Math.round(new Date(mobileClientBuild.status.startTimestamp).getTime()/1000));
                        const durationString = this.getDurationString(durationSeconds)
                        return (
                            <div className={i === 0 ? 'build-history-item-top': 'build-history-item'}>
                                <ListGroupItem  key={mobileClientBuild.metadata.uid}>
                                    <Col md={12}>
                                        <div >{/* + (i === mobileClientBuilds.length - 1 ? "" : "-top") */}
                                            <Col md={2}>
                                                <BuildStatus build={mobileClientBuild}></BuildStatus> <a class-name="incSizeLink">Build #{buildNumber} </a>
                                            </Col>
                                            <Col md={2}>
                                                {phase} <a className="left-margin-link">View log</a>
                                            </Col>
                                            <Col md={2}>
                                                <span>
                                                    <Moment fromNow>{mobileClientBuild.status.startTimestamp}</Moment>
                                                </span>
                                            </Col>
                                            <Col md={4}>
                                                <p>Duration: </p> {durationString}
                                            </Col>
                                            <Col md={2}>
                                                <Button>
                                                    Download
                                                </Button>
                                            </Col>
                                        </div>
                                    </Col>
                                </ListGroupItem>
                            </div>
                )})}
            </ListGroup>
        );
    }
}

export default MobileClientBuildHistoryList;