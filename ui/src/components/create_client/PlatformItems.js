import React, { Component } from 'react';
import { Grid } from 'patternfly-react';
import './create_client.css';

/**
 * This class manages a set of platform icons and allows the user to choose one.
 * When an item is choosen, the provided 'itemSelected' callback is invoked passing the id of the selected platform.
 */
class PlatformItems extends Component {
  rows() {
    const rows = [];
    React.Children.map(this.props.children, (child, i) => {
      rows.push(
        <Grid.Col sm={6} md={2} key={i}>
          {child}
        </Grid.Col>
      );
      return child;
    });
    return rows;
  }

  render() {
    return (
      <Grid bsClass="platform-items">
        <Grid.Row>{this.rows()}</Grid.Row>
      </Grid>
    );
  }
}

export default PlatformItems;
