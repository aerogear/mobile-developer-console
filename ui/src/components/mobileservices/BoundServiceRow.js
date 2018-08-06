import React, { Component } from 'react';
import { ListViewItem, Row, Col } from 'patternfly-react';
import '../ServiceSDKInfo.css';
import './ServiceRow.css';

class BoundServiceRow extends Component {

    constructor(props) {
        super(props);
        
        this.service = props.service;

        this.renderServiceBadge = this.renderServiceBadge.bind(this);
        this.renderServiceDetails = this.renderServiceDetails.bind(this);
    }    

    renderServiceBadge() {
        return (
            <Col md={3} className="service-sdk-info">
                <Col md={12}>
                <img src={this.service.serviceLogoUrl} alt="" />
                <div className="service-name">
                    <h4>
                    <div>{this.service.serviceName}</div>
                    <div><small>{this.service.serviceId}</small></div>
                    </h4>
                </div>
                </Col>
            </Col>
        );
    }

    renderServiceDetails() {
        return (
            <div>
                <Row>
                <Col md={2} className="detailsKey">
                        Key : 
                    </Col>
                    <Col md={4}  className="detailsValue">
                        Value
                    </Col>
                </Row>
                <Row>
                <Col md={2} className="detailsKey">
                        Key : 
                    </Col>
                    <Col md={4}  className="detailsValue">
                        Value
                    </Col>
                </Row>
                <Row>
                <Col md={2} className="detailsKey">
                        Key : 
                    </Col>
                    <Col md={4}  className="detailsValue">
                        Value
                    </Col>
                </Row>
                <Row>
                <Col md={2} className="detailsKey">
                        Key : 
                    </Col>
                    <Col md={4}  className="detailsValue">
                        Value
                    </Col>
                </Row>
                <Row>
                <Col md={2} className="detailsKey">
                        Key : 
                    </Col>
                    <Col md={4}  className="detailsValue">
                        Value
                    </Col>
                </Row>
                
            </div>
        );
    }

    render() {
        
      return (
        <ListViewItem 
            additionalInfo={this.renderServiceBadge()}
        >
            {this.renderServiceDetails()}
        </ListViewItem>
        );
    }
}

export default BoundServiceRow