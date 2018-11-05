import React from 'react';
import { Card, CardHeading, CardTitle, CardBody, CardFooter, DropdownKebab } from 'patternfly-react';
import { Link } from 'react-router-dom';
import DeleteItemButton from '../../containers/DeleteItemButton';
import EditItemButton from '../../containers/EditItemButton';
import PlatformIcon from '../common/PlatformIcon';

const getServiceIcons = (services) => {
  const icons = {
    metrics: <img alt="Metrics" className="icon" src="/img/metrics.png" />,
    keycloak: <img alt="Keycloak" className="icon" src="/img/keycloak.png" />,
    push: <img alt="Push" className="icon" src="/img/push.png" />,
    sync: <img alt="Sync" className="icon" src="/img/sync.svg" />,
  };
  return services
    .map((service, i) => <span className="service-icon" key={i}>{icons[service.type]}</span>);
};

const MobileClientCardViewItem = (props) => {
  const {
    app,
    app: { metadata: { name: appName } },
    services,
    builds,
    buildTabEnabled
  } = props;
  return (
    <div className="col-xs-12 col-sm-6 col-md-4 col-lg-3">
      <Card matchHeight /*accented*/ className="mobile-client-card">
        <CardHeading>
          <DropdownKebab id={app.metadata.name} pullRight className="card-dropdown-kebab">
            <EditItemButton item={app} />
            <DeleteItemButton itemType="app" itemName={appName} item={app} />
          </DropdownKebab>
          <CardTitle>
            {
              buildTabEnabled && builds.numFailedBuilds > 0 ?
                <span><span className="pficon pficon-error-circle-o" />{builds.numFailedBuilds}</span>
              :
                null
            }
            {
              buildTabEnabled && builds.numInProgressBuilds > 0 ?
                <span><span className="pficon fa fa-refresh fa-spin fa-fw" />{builds.numInProgressBuilds}</span>
              :
                null
            }
            {
              (buildTabEnabled && builds.numFailedBuilds === 0 && builds.numInProgressBuilds === 0) ?
                <span />
              :
                null
            }
          </CardTitle>
        </CardHeading>
        
        <Link to={`/mobileclient/${app.metadata.name}`}>
          <CardBody>
            <div className="card-body-icon">
              <PlatformIcon platform={app.spec.clientType} />
            </div>
            <div className="card-body-title">
              <h1>{app.spec.name}</h1>
            </div>
          </CardBody>
          <CardFooter>
            <div className="card-footer-icons">
            {
              (services && services.length > 0) ?
                getServiceIcons(services)
              :
                <div className="service-icon" />
            }
            </div>
          </CardFooter>
        </Link>
      </Card>
    </div>
  );
};

export default MobileClientCardViewItem;
