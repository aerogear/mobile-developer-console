import React, { Component } from 'react';
import { Row, ListView, DropdownKebab, MenuItem} from 'patternfly-react';

const actions = () => (
  <DropdownKebab id="mobile-client-actions" pullRight>
    <MenuItem>Edit</MenuItem>
    <MenuItem>Delete</MenuItem>
  </DropdownKebab>
);

const headings = mobileClient => (
    <div className="pull-left text-left">
        <div>
            <span>{mobileClient.spec.clientType}</span>
        </div>
        <a>
         <span>{mobileClient.spec.name}</span>
        </a>
        <div>{mobileClient.spec.appIdentifier}</div>
    </div>
);

class MobileClientOverviewList extends Component {
    render = () => {
        const mobileClients = Object.values(this.props.mobileClients || {});

        return (
            <div>
                <ListView>
                    {mobileClients.map(
                        mobileClient => (
                            <ListView.Item
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