import Moment from 'react-moment';
import React from 'react';
import { Card, CardActions, CardHead, CardHeader, CardBody, CardFooter, Dropdown, DropdownToggle } from '@patternfly/react-core'; 
import { Link } from 'react-router-dom';
import DeleteItemButton from '../../containers/DeleteItemButton';
import { CloseIcon } from '@patternfly/react-icons';
import './MobileClientCardViewItem.css';

const getServiceIcons = services => {
  const icons = {
    metrics: <img alt="Metrics" className="icon" src="/img/metrics.svg" />,
    keycloak: <img alt="Keycloak" className="icon" src="/img/keycloak.svg" />,
    push: <img alt="Push" className="icon" src="/img/push.svg" />,
    sync: <img alt="Sync" className="icon" src="/img/sync.svg" />,
    'sync-app': <img alt="Sync" className="icon" src="/img/sync.svg" />,
    security: <img alt="Security" className="icon" src="/img/security.svg" />
  };
  return services.map((service, i) => (
    <span className="service-icon" key={i}>
      {icons[service.type]}
    </span>
  ));
};

class MobileClientCardViewItem extends React.Component {
  state = {
    isOpen: false
  }

  onToggle = isOpen => {
    this.setState({
      isOpen
    });
  };

  onSelect = event => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  };

  render(){
    
    const {
      app,
      app: {
        metadata: { name: appName }
      },
      services,
      builds,
      buildTabEnabled
    } = this.props;
    return (
        <Card matchHeight /* accented */ className="mobile-client-card">
          <CardHead>
            <CardActions>
              <Dropdown id={appName}
                position={'right'}
                onSelect={this.onSelect}
                toggle={<DropdownToggle iconComponent={CloseIcon} onToggle={this.onToggle} />}
                isOpen={this.state.isOpen}
                isPlain
                dropdownItems={[<DeleteItemButton itemType="app" itemName={appName} item={app} />]} />
            </CardActions>
            <CardHeader>
            <Link to={`/mobileclient/${appName}`}>
              <b>{appName}</b>
            </Link>
          </CardHeader>
          </CardHead>
          <CardBody style={{ paddingTop: 0 }}>
              {services && services.length > 0 ? "Bound Services" : ""}
              <div className="card-icons">
                {services && services.length > 0 ? getServiceIcons(services) : <div className="service-icon" />}
              </div>
            </CardBody>
            <Link to={`/mobileclient/${appName}`}>
            <CardFooter>
              <div className="creation-timestamp">Created 
                 <Moment format=" DD MMMM YYYY">{app.metadata.creationTimestamp}</Moment>
              </div>
              <span className="builds">
                {buildTabEnabled && builds.numFailedBuilds > 0 ? (
                  <span>
                    <span className="pficon pficon-error-circle-o" />
                    {builds.numFailedBuilds}
                  </span>
                ) : null}
                {buildTabEnabled && builds.numInProgressBuilds > 0 ? (
                  <span>
                    <span className="pficon fa fa-refresh fa-spin fa-fw" />
                    {builds.numInProgressBuilds}
                  </span>
                ) : null}
                {!buildTabEnabled || (builds.numFailedBuilds === 0 && builds.numInProgressBuilds === 0) ? <span /> : null}
              </span>
            </CardFooter>
          </Link>
        </Card>
    );
  };
};

export default MobileClientCardViewItem;
