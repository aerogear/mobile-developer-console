import React, { Component } from 'react';
import { PLATFORM_ANDROID, PLATFORM_IOS, PLATFORM_CORDOVA, PLATFORM_XAMARIN } from './Constants'

/**
 * This represent a single platform item to be choosen into the UI when creating clients
 */
class PlatformItem extends Component {
  constructor(props) {
    super(props);
    this.state = { id: this.props.type, selected: props.selected }
  }

  platforms = {
    [PLATFORM_ANDROID]: { icon: <span className='fa fa-android' />, name: 'Android' },
    [PLATFORM_IOS]: { icon: <span className='fa fa-apple' />, name: 'iOS' },
    [PLATFORM_CORDOVA]: { icon: <span><img src='../../img/cordova.png' alt='Cordova' /></span>, name: 'Cordova' },
    [PLATFORM_XAMARIN]: { icon: <span><img src='../../img/xamarin.svg' alt='Xamarin' /></span>, name: 'Xamarin' }
  }

  componentDidUpdate() {
    if (this.state.selected) {
      this.setState({ selected: true })
      this.props.itemSelected({ ...this.state, selected: true });
    }
  }

  handleClick = (e) => {
    const state = { selected: true, id: this.props.type };
    this.setState(state);
    this.props.itemSelected(state);
    e.preventDefault();
  }

  getDefaultPlatformProperty(platformId, property) {
    var platformDefaults = this.platforms[platformId];
    if (platformDefaults) {
      return platformDefaults[property];
    }

    // platform not supported
    return null;
  }

  platformItemIcon() {
    var icon;
    if (this.props.inclass) {
      // fa icon
      icon = <span className={this.props.inclass} />;
    } else if (this.props.img) {
      // img icon
      icon = <span><img src={this.props.img} alt={this.props.alt} /></span>;
    } else {
      // render children
      icon = this.props.children;
    }

    if (!icon) {
      // no custom icon has been provided. Using standard icons.
      icon = this.getDefaultPlatformProperty(this.props.type, 'icon');
    }

    return (
      <div className="platform-item-icon">
        {icon}
      </div>
    );
  }

  render() {
    var styleclass = this.props.selection === this.props.type ? 'platform-item selected' : 'platform-item';
    return (
      <div>
        <a className={styleclass} href="#nothing" onClick={this.handleClick}>
          <div className="platform-item-icon-container">
            {this.platformItemIcon()}
          </div>
          <div className="platform-item-name" title={this.props.title}>
            {this.props.title ? this.props.title : this.getDefaultPlatformProperty(this.props.type, 'name')}
          </div>
        </a>
      </div>
    )
  }
}

export default PlatformItem;
