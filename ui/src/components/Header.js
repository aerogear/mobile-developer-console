import React, { Component } from 'react';

class Header extends Component {
  render() {
    return (
      <h3
        style={{
          borderBottomWidth: 1,
          borderBottomStyle: 'solid',
          borderBottomColor: '#eee',
          paddingBottom: 10,
          ...this.props.style
        }}
      >
        {this.props.children}
      </h3>
    );
  }
}

export default Header;
