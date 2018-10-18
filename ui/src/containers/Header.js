import React, { Component } from 'react';
import NavHeader from '../components/common/NavHeader';
import { connect } from 'react-redux';
import { fetchUserInfo } from '../actions/users';

class Header extends Component {
  componentWillMount() {
    this.props.fetchUserInfo();
  }

  render() {
    const {user} = this.props;
    const helpDropdowns = [{
      text: "Documentation",
      // TODO: once there is a documentation for MDC, this link should point straight to it
      href: 'http://docs.aerogear.org/'
    }];
    const userDropdowns = [{
      text: "Logout",
      //the sign in endpoint will perform the sign out action, and return the login page
      href: "/oauth/sign_in"
    }];
    return (
      <NavHeader title="Mobile Developer Console"
        user={user}
        helpDropdownItems={helpDropdowns}
        userDropdownItems={userDropdowns}
      />
    )
  }
}

function mapStateToProps(state) {
  return {
    user: state.user.currentUser
  }
}

const mapDispatchToProps = {
  fetchUserInfo
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
