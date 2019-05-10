import React, { Component } from 'react';
import { ListView } from 'patternfly-react';

import './MobileListViewItem.css';

class MobileListViewItem extends Component {
  render = () => (
    <ListView.Item {...this.props} className={`mobile-list-view-item ${this.props.className}`}>
      {this.props.children}
    </ListView.Item>
  );
}

export default MobileListViewItem;
