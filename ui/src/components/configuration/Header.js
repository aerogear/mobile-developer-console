import React, { Component } from 'react';
import classNames from 'classnames';

import './Header.css';

class Header extends Component {
  render() {
    return <h3 className={classNames('header', this.props.className)}>{this.props.children}</h3>;
  }
}

export default Header;
