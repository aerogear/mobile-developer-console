import React, { Component } from 'react';
import MobileClientOverviewList from './MobileClientOverviewList';

const listClientsUrl = `/apis/mobile.k8s.io/v1alpha1/namespaces/test1/mobileclients`;

class Overview extends Component {

  constructor(props) {
    super(props);

    this.state = {
      mobileClients: []
    };
  }

  componentDidMount = () => {
    fetch(listClientsUrl)
      .then(response => response.json())
      .then(result => {
        this.setState({mobileClients: result.items});
      })
      .catch(err => {
        console.error('Fetch error: ', err)
      });
  }

  render() {
    return (
      <div>
        <MobileClientOverviewList mobileClients={this.state.mobileClients}></MobileClientOverviewList>
      </div>
    );
  }
}

export default Overview;
