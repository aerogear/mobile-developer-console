import React, { Component } from 'react';

class PlatformItem extends Component {
  state = { selected: this.props.selected };

  render = () => (
    <div>
      <a
        className={this.state.selected ? 'platform-item selected' : 'platform-item'}
        href="#nothing"
        onClick={this.handleClick}
      >
        <div className="platform-item-icon-container">{this.platformItemIcon()}</div>
        <div className="platform-item-name" title={this.props.title}>
          {this.props.title}
        </div>
      </a>
    </div>
  );

  handleClick = e => {
    const state = { selected: true, id: this.props.id };
    this.setState(state);
    this.props.itemSelected(state);
    e.preventDefault();
  };

  platformItemIcon() {
    const inside = this.props.inclass === undefined ? this.props.children : <span className={this.props.inclass} />;
    return <div className="platform-item-icon">{inside}</div>;
  }
}

export default PlatformItem;
