import React from 'react';
import { Masthead, MenuItem, Icon } from 'patternfly-react';
import { withRouter } from 'react-router-dom';
import './NavHeader.css';

export const _NavHeader = ({ title, user, helpDropdownItems, userDropdownItems, titleHref, history }) => (
  <Masthead title={title} navToggle={false} onTitleClick={() => history.push(titleHref)}>
    <Masthead.Collapse>
      <Masthead.Dropdown id="app-help-dropdown" noCaret title={<span title="Help" className="pficon pficon-help" />}>
        {helpDropdownItems.map((item, index) => (
          <MenuItem
            key={index}
            eventKey={index}
            onClick={e => {
              e.preventDefault();
              window.open(item.href);
            }}
          >
            {item.text}
          </MenuItem>
        ))}
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
        {userDropdownItems.map((item, index) => (
          <MenuItem key={index} eventKey={index} href={item.href}>
            {' '}
            {item.text}{' '}
          </MenuItem>
        ))}
      </Masthead.Dropdown>
    </Masthead.Collapse>
  </Masthead>
);

export default withRouter(_NavHeader);
