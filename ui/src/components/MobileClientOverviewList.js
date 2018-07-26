import React, { Component } from 'react';
import { Row, ListView, DropdownKebab, MenuItem} from 'patternfly-react';

import './OverviewListItemHeader.css';

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
                                {this.props.children}
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