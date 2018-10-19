import React, { Component } from 'react';

/**
 * This represent a single platform item to be choosen into the UI when creating clients
 */
class PlatformItem extends Component {

    constructor(props){
      super(props);
      this.state = { id: this.props.id, selected: props.selected }
    }

    componentDidUpdate() {
      if (this.state.selected) {
        this.setState({selected: true})
        this.props.itemSelected({ ...this.state, selected: true});
      } 
    }

    render() {
      var styleclass = this.props.selection === this.props.id ? 'platform-item selected' : 'platform-item';
      return (
      <div>
        <a className={styleclass} href="#nothing" onClick={this.handleClick}>
          <div className="platform-item-icon-container">
            {this.platformItemIcon()}
          </div>
          <div className="platform-item-name" title={this.props.title}>
            {this.props.title}
          </div>
        </a>
      </div>
      )
    }

    handleClick=(e) => {
      const state = { selected: true, id: this.props.id };
      this.setState(state);
      this.props.itemSelected(state);
      e.preventDefault();
    }

    platformItemIcon() {
      var icon;
      if (this.props.inclass) {
        // fa icon
        icon = <span className={this.props.inclass} />;
      } else if (this.props.img) {
        // img icon
        icon = <span><img src={this.props.img} alt={this.props.alt}/></span>;
      } else {
        // render children
        icon = this.props.children;
      }

      return (
        <div className="platform-item-icon">
          {icon}
        </div>
      );
    }
}

export default PlatformItem;
