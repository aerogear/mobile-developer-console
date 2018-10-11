import React, { Component } from 'react';
import NavHeader from '../components/common/NavHeader';
import { connect } from 'react-redux';
import { fetchUserInfo, logout } from '../actions/users';

class Header extends Component {
  componentWillMount() {
    this.props.fetchUserInfo();
  }

  render() {
    const {user} = this.props;
    const helpDropdowns = [{
      text: "Documentation",
      onSelect: () => {
        console.log("Implement me!!");
      }
    }];
    const userDropdowns = [{
      text: "Logout",
      onSelect: this.props.logout
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
  fetchUserInfo,
  logout
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
