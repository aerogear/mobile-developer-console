import React from "react";
import { Masthead, MenuItem, Icon } from "patternfly-react";

import './NavHeader.css';

const NavHeader = ({ title, user, helpDropdownItems, userDropdownItems }) => (
  <nav className="navbar navbar-pf-vertical">
    <div className="navbar-header">
      <a role="button" className="navbar-brand">
        {title}
      </a>
    </div>
    <Masthead.Collapse>
      <Masthead.Dropdown
        id="app-help-dropdown"
        noCaret
        title={<span title="Help" className="pficon pficon-help" />}
      >
        {
          helpDropdownItems.map((item, index) => (
            <MenuItem key={index} eventKey={index} href={item.href}>{item.text}</MenuItem>
          ))
        }
        </Masthead.Dropdown>
        <Masthead.Dropdown
          id="app-user-dropdown"
          title={[
            <Icon type="pf" name="user" key="user-icon" />,
            <span className="dropdown-title" key="dropdown-title">
              {user && user.name}
            </span>
          ]}
        >
        {
          userDropdownItems.map((item, index) => (
            <MenuItem key={index} eventKey={index} onSelect={item.onSelect}> {item.text} </MenuItem>
          ))
        }
      </Masthead.Dropdown>
    </Masthead.Collapse>
  </nav>
);

export default NavHeader;
