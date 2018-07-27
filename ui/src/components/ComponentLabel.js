import React, { Component } from 'react';

class ComponentLabel extends Component {
  render() {
    return (
      <div style={{
        paddingTop: 15,
        borderBottomWidth: 1,
        borderBottomStyle: 'solid',
        borderBottomColor: '#dcdcdc',
        lineHeight: 1,
        marginBottom: 10,
        paddingBottom: 5,
        alignSelf: 'center',
        color: '#757575',
        fontSize: 10,
        paddingRight: 10,
        textTransform: 'uppercase'
      }}>
        {this.props.children}
      </div>
    );
  }
}

export default ComponentLabel;
