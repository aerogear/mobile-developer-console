import { Component } from 'react';
import moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';

momentDurationFormatSetup(moment);

class Duration extends Component {
  constructor(props) {
    super(props);

    this.state = {
      timeSinceLastUpdate: 0
    };
  }

  componentDidMount() {
    if (this.props.inProgress) {
      this.timerID = setInterval(this.tick, 1000);
    }
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
    this.timerID = null;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.duration !== this.props.duration) {
      this.setState({
        timeSinceLastUpdate: 0
      });
    }
    if (!this.props.inProgress && this.timerID) {
      clearInterval(this.timerID);
      this.timerID = null;
    }
  }

  tick = () => {
    this.setState(state => ({
      timeSinceLastUpdate: state.timeSinceLastUpdate + 1
    }));
  };

  render() {
    const { duration, inProgress } = this.props;

    return moment
      .duration(duration + (inProgress ? this.state.timeSinceLastUpdate * 1000 : 0))
      .format('h[h] m[m] s[s]');
  }
}

export default Duration;
