import React, { Component } from 'react';
import { Grid, Row, Col } from 'patternfly-react';
import BoundServiceRow from './BoundServiceRow'
class MobileServiceView extends Component {

    constructor(props) {
        super(props);
    
        this.state = {
          boundServices: [{
            serviceLogoUrl: 'https://pbs.twimg.com/profile_images/702119821979344897/oAC05cEB_400x400.png',
            serviceName: 'Identity Management',
            serviceId: 'dh-keycloak-apb-h7k9j',
            serviceDescription: 'Identity Management - Identity and Access Management',
            setupText: 'Identity Management SDK setup'
          }, {
            serviceLogoUrl: 'https://avatars1.githubusercontent.com/u/3380462?s=200&v=4',
            serviceName: 'Mobile Metrics',
            serviceId: 'dh-metrics-apb-wqm5c',
            serviceDescription: 'Installs a metrics service based on Prometheus and Grafana',
            setupText: 'Mobile Metrics SDK setups'
          }],
          unboundServices: [],
        };

        this.boundServiceRows = this.boundServiceRows.bind(this);
        this.unboundServiceRows = this.unboundServiceRows.bind(this);
    }    

    boundServiceRows() {
        var rows = [];
        this.state.boundServices.forEach( service => {
            rows.push(<BoundServiceRow service={service}/>);
        });
        return rows;
            
    }

    unboundServiceRows() {
        return [];
    }

    render() {
        
      return (
          <div>
            {this.boundServiceRows()}
            {this.unboundServiceRows()}
          </div>
        );
    }
}

export default MobileServiceView;