import React, { Component } from 'react';
import { Dropdown, MenuItem } from 'patternfly-react';

import './FormDropdown.css';

class FormDropdown extends Component {
  constructor(props) {
    super(props);

    this.state = { active: 0 };
  }

  render = () => (
    <Dropdown className="form-dropdown" id={this.props.id}>
      <Dropdown.Toggle className="form-dropdown form-control">{this.props.items[this.state.active]}</Dropdown.Toggle>
      <Dropdown.Menu>
        {this.props.items.map((item, i) => (
          <MenuItem
            key={i}
            active={i === this.state.active}
            onClick={() => {
              this.setState({ active: i });
              this.props.onSelect && this.props.onSelect(i);
            }}
          >
            {item}
          </MenuItem>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default FormDropdown;
