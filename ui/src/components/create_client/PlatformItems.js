import React, { Component } from 'react';
import { Grid } from 'patternfly-react';
import './create_client.css';

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

  isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  rows() {

    let rows = [];

    React.Children.map(this.props.children, (child, i) => {

      var selectionStatus = false;

      if (i === 0 && this.isEmpty(this.platformItems)) {
        selectionStatus = true;
      }

      var configuredChildren = React.cloneElement(child, { itemSelected: this.itemSelected, selection: this.selection.id, key: this.selection.id, selected: selectionStatus });

      rows.push(
        <Grid.Col sm={6} md={2}>
          {configuredChildren}
        </Grid.Col>
      );

      return this.platformItems[configuredChildren.props.id] = configuredChildren;
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