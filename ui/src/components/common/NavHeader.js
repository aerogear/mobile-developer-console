import React, { Component } from "react";
import { Masthead, MenuItem, Icon } from "patternfly-react";

class NavHeader extends Component {
  render = () => (
    <Masthead title={this.props.title} navToggle={false}>
    <Masthead.Collapse>
        <Masthead.Dropdown
          id="app-help-dropdown"
          noCaret
          title={<span title="Help" className="pficon pficon-help" />}
        >
        {
          this.props.helpDropdownItems.map((item, index) => (
            <MenuItem key={index} eventKey={index} onSelect={item.onSelect}>{item.text}</MenuItem>
          ))
        }
        </Masthead.Dropdown>
        <Masthead.Dropdown
          id="app-user-dropdown"
          title={[
            <Icon type="pf" name="user" key="user-icon" />,
            <span className="dropdown-title" key="dropdown-title">
              {this.props.user.name}
            </span>
          ]}
        >
        {
          this.props.userDropdownItems.map((item, index) => (
            <MenuItem key={index} eventKey={index} onSelect={item.onSelect}> {item.text} </MenuItem>
          ))
        }
        </Masthead.Dropdown>
      </Masthead.Collapse>
      </Masthead>
  )
}

export default NavHeader;