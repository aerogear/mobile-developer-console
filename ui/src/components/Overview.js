import React, { Component } from 'react';
import MobileClientOverviewList from './MobileClientOverviewList';
import MobileClientServiceChart from './MobileClientServiceChart';

const listClientsUrl = `/apis/mobile.k8s.io/v1alpha1/namespaces/test1/mobileclients`;

// todo 
const mobileServices = {
  "mobileServices": {
    "bound": 1,
    "unbound": 2
  }
};

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
        <MobileClientServiceChart mobileServices={mobileServices}></MobileClientServiceChart>
      </div>
    );
  }
}

export default Overview;
