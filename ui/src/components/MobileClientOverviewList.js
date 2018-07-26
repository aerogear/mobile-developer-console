import React, { Component } from 'react';
import { Row, Col, ListView, DropdownKebab, MenuItem} from 'patternfly-react';

import MobileClientServiceChart from './MobileClientServiceChart';
import ComponentSectionLabel from './common/ComponentSectionLabel';

import './OverviewListItemHeader.css';

// todo 
const mobileServices = {
    "mobileServices": {
        "bound": 1,
        "unbound": 2
    }
};

const actions = () => (
  <DropdownKebab id="mobile-client-actions" pullRight>
    <MenuItem>Edit</MenuItem>
    <MenuItem>Delete</MenuItem>
  </DropdownKebab>
);

const headings = mobileClient => (
    <div className="pull-left text-left">
        <div className="detail">
            <span className="text-uppercase">{mobileClient.spec.clientType}</span>
        </div>
        <a className="name">
            <span>{mobileClient.spec.name}</span>
        </a>
        <div className="detail">{mobileClient.spec.appIdentifier}</div>
    </div>
);

class MobileClientOverviewList extends Component {
    render = () => {
        const {mobileClients} = this.props;

        return (
            <div>
                <ListView>
                    {mobileClients.map(
                        mobileClient => (
                            <ListView.Item
                                className="mobile-client-list-view-item overview-list-view-item"
                                key={mobileClient.metadata.uid}
                                actions={actions()}
                                checkboxInput={false}
                                heading={headings(mobileClient)}
                                stacked={false}
                                hideCloseIcon={true}
                            >
                            <Row>
                                <Col md={12}>NOT BOUND NOTIFICATION COMPONENT</Col>
                                <Col md={6}>
                                    <ComponentSectionLabel>Mobile Services</ComponentSectionLabel>
                                    <MobileClientServiceChart mobileServices={mobileServices}></MobileClientServiceChart>
                                    <div>
                                        <a>View All Mobile Services</a>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <ComponentSectionLabel>Client Info</ComponentSectionLabel>
                                </Col>
                                <Col md={12}>
                                <ComponentSectionLabel>Mobile Builds</ComponentSectionLabel>
                                </Col>
                            </Row>
                            </ListView.Item>
                        )
                    )}
                </ListView>
            </div>
        );
    }
}

export default MobileClientOverviewList;