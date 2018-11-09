import React, { Component } from 'react';
import { PLATFORM_ANDROID, PLATFORM_IOS, PLATFORM_CORDOVA, PLATFORM_XAMARIN } from './Constants';
import { connect } from 'react-redux';
import { selectPlatform } from '../../actions/apps';
import { MobileApp } from '../../model/mobileapp';
/**
 * This represent a single platform item to be choosen into the UI when creating clients
 */
class PlatformItem extends Component {
  platforms = {
    [PLATFORM_ANDROID]: { icon: <span className="fa fa-android" />, name: 'Android' },
    [PLATFORM_IOS]: { icon: <span className="fa fa-apple" />, name: 'iOS' },
    [PLATFORM_CORDOVA]: {
      icon: (
        <span>
          <img src="../../img/cordova.png" alt="Cordova" />
        </span>
      ),
      name: 'Cordova'
    },
    [PLATFORM_XAMARIN]: {
      icon: (
        <span>
          <img src="../../img/xamarin.svg" alt="Xamarin" />
        </span>
      ),
      name: 'Xamarin'
    }
  };

  handleClick = e => {
    this.props.selectPlatform(this.props.type);
    e.preventDefault();
  };

  getDefaultPlatformProperty(platformId, property) {
    const platformDefaults = this.platforms[platformId];
    if (platformDefaults) {
      return platformDefaults[property];
    }

    // platform not supported
    return null;
  }

  platformItemIcon() {
    let icon;
    if (this.props.inclass) {
      // fa icon
      icon = <span className={this.props.inclass} />;
    } else if (this.props.img) {
      // img icon
      icon = (
        <span>
          <img src={this.props.img} alt={this.props.alt} />
        </span>
      );
    } else {
      // render children
      icon = this.props.children;
    }

    if (!icon) {
      // no custom icon has been provided. Using standard icons.
      icon = this.getDefaultPlatformProperty(this.props.type, 'icon');
    }

    return <div className="platform-item-icon">{icon}</div>;
  }

  render() {
    const app = new MobileApp({ ...this.props.ui.app });
    const styleclass = app.getType() === this.props.type ? 'platform-item selected' : 'platform-item';
    return (
      <div>
        <a className={styleclass} href="#nothing" onClick={this.handleClick}>
          <div className="platform-item-icon-container">{this.platformItemIcon()}</div>
          <div className="platform-item-name" title={this.props.title}>
            {this.props.title ? this.props.title : this.getDefaultPlatformProperty(this.props.type, 'name')}
          </div>
        </a>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    ui: state.apps.createClientAppDialog
  };
}

const mapDispatchToProps = {
  selectPlatform
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlatformItem);
