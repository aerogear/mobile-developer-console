import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Switch, Redirect, Route, NavLink } from 'react-router-dom';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons';
import {
  Brand,
  Page,
  PageHeader,
  Toolbar,
  ToolbarGroup,
  ToolbarItem,
  DropdownToggle,
  Dropdown,
  DropdownItem,
  Nav,
  NavList,
  NavItem,
  NavVariants
} from '@patternfly/react-core';
import MDCAboutModal from './MDCAboutModal';
import Overview from '../containers/Overview';
import Configuration from '../containers/Configuration';
// import Configuration from '../components/configuration/FrameworkSDKDocs';
import Client from '../containers/Client';
import ErrorMessages from '../containers/ErrorMessages';
import { fetchUserInfo } from '../actions/users';
import { getLogo, getDocumentation } from '../services/openshift';
import './App.css';

class App extends React.Component {
  state = {
    isDropdownOpen: false,
    isIconOpen: false,
    isModalOpen: false
  };

  componentWillMount() {
    this.props.fetchUserInfo();
  }

  onDropdownToggle = () => {
    this.setState({ isDropdownOpen: !this.state.isDropdownOpen });
  };

  onIconToggle = () => {
    this.setState({ isIconOpen: !this.state.isIconOpen });
  };

  onModalToggle = () => {
    this.setState({ isModalOpen: !this.state.isModalOpen });
  };

  render() {
    const PageNav = (
      <Nav aria-label="Nav">
        <NavList variant={NavVariants.horizontal}>
          <NavItem to="/overview">
            <NavLink activeClassName="pf-m-current" to="/overview">
              Mobile Apps
            </NavLink>
          </NavItem>
          <NavItem to="/configuration">
            <NavLink activeClassName="pf-m-current" to="/configuration">
              SDK Configuration
            </NavLink>
          </NavItem>
        </NavList>
      </Nav>
    );

    const userDropdownItems = [
      <DropdownItem key="mdc_logout">
        <a href="/oauth/sign_in">Logout</a>
      </DropdownItem>
    ];

    const questionIconItems = [
      <DropdownItem key="mdc_docs">
        <a href={getDocumentation()}>Documentation</a>
      </DropdownItem>,
      <DropdownItem key="about" onClick={this.onModalToggle}>
        About
      </DropdownItem>
    ];

    const PageToolbar = (
      <Toolbar>
        <ToolbarGroup>
          <ToolbarItem>
            <Dropdown
              isPlain
              position="right"
              isOpen={this.state.isIconOpen}
              onSelect={this.onDropdownSelect}
              toggle={
                <DropdownToggle onToggle={this.onIconToggle} iconComponent={null}>
                  <OutlinedQuestionCircleIcon />
                </DropdownToggle>
              }
              dropdownItems={questionIconItems}
            />
            <Dropdown
              isPlain
              position="right"
              isOpen={this.state.isDropdownOpen}
              onSelect={this.onDropdownSelect}
              toggle={
                <DropdownToggle onToggle={this.onDropdownToggle}>
                  {this.props.user ? this.props.user.name : 'Unknown'}
                </DropdownToggle>
              }
              dropdownItems={userDropdownItems}
            />
          </ToolbarItem>
        </ToolbarGroup>
      </Toolbar>
    );

    return (
      <Router>
        <ErrorMessages />
        <MDCAboutModal isOpen={this.state.isModalOpen} onClose={this.onModalToggle} user={this.props.user} />
        <Page
          header={
            <PageHeader
              logo={<Brand src={getLogo()} alt="Mobile Developer Console Logo" style={{ width: '150px' }} />}
              toolbar={PageToolbar}
              topNav={PageNav}
            />
          }
        >
          <Switch>
            <Route exact path="/overview" component={Overview} />
            <Route exact path="/mobileclient/:id" component={Client} />
            <Route exact path="/configuration" component={Configuration} />
            {/* Default redirect */}
            <Redirect to="/overview" />
          </Switch>
        </Page>
      </Router>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user.currentUser
  };
}

const mapDispatchToProps = {
  fetchUserInfo
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
