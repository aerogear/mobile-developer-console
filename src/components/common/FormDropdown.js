import React, { Component } from 'react';
import { Dropdown, MenuItem } from 'patternfly-react';

import './FormDropdown.css';

class FormDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render = () => {
    const { id, items, titles, onSelect, selected } = this.props;
    const { active = selected ? items.indexOf(selected) : 0 } = this.state;
    return (
      <Dropdown className="form-dropdown" id={id}>
        <Dropdown.Toggle className="form-dropdown form-control">
          {titles ? titles[active] : items[active]}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {items.map((key, i) => {
            const value = titles ? titles[i] : key;
            return (
              <MenuItem
                key={key}
                active={i === active}
                onClick={() => {
                  this.setState({ active: i });
                  onSelect && onSelect(key);
                }}
              >
                {value}
              </MenuItem>
            );
          })}
        </Dropdown.Menu>
      </Dropdown>
    );
  };
}

export default FormDropdown;
