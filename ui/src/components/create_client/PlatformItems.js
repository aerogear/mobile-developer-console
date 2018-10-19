import React, { Component } from 'react';
import { Grid } from 'patternfly-react';
import './create_client.css';

/**
 * This class manages a set of platform icons and allows the user to choose one.
 * When an item is choosen, the provided 'itemSelected' callback is invoked passing the id of the selected platform.
 */
class PlatformItems extends Component {
  constructor(props) {
    super(props);
    this.rows = this.rows.bind(this)
    this.platformItems = {};
    this.selection = {}
  }

  /* contains the list of selected platforms */
  state = { items: {} }

  /* this is called by platform items when a platform item is clicked */
  itemSelected = (clickedItem) => {
    var platformItems = this.platformItems;
    this.selection.id = clickedItem.id;
    for (var key in platformItems) {
      var itemIsSelected = key === clickedItem.id
      this.setState({...this.state, items: {...this.state.items, [key]: { selected: itemIsSelected } }} )

      if (itemIsSelected) {
        this.props.itemSelected({ id: key });
      }
    }
  }

  rows() {
    let rows = [];
    React.Children.map(this.props.children, (child, i) => {
      var selectionStatus = false;
      if (i === 0 && Object.keys(this.platformItems).length === 0) {
        selectionStatus = true;
      }
      var configuredChildren = React.cloneElement(child, { itemSelected: this.itemSelected, selection: this.selection.id, key: this.selection.id, selected: selectionStatus });
      rows.push(
        <Grid.Col sm={6} md={2}>
          {configuredChildren}
        </Grid.Col>
      );
      return this.platformItems[configuredChildren.props.type] = configuredChildren;
    });
    return rows;
  }

  render() {
    return (
      <Grid bsClass="platform-items">
        <Grid.Row>
          {this.rows()}
        </Grid.Row>
      </Grid>
    )
  }
}

export default PlatformItems;