import React, { Component } from 'react';
import { Button } from 'patternfly-react';
import { connect } from 'react-redux';
import { triggerBuild } from '../actions/builds';

class StartBuildButton extends Component {
  triggerBuild = () => {
    this.props.triggerBuild(this.props.jobName);
  };

  render = () => <Button onClick={this.triggerBuild}>Start Build</Button>;
}

const mapDispatchToProps = {
  triggerBuild
};

export default connect(
  null,
  mapDispatchToProps
)(StartBuildButton);
