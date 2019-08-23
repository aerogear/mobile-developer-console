import Moment from 'react-moment';
import React from 'react';
import { Card, CardHeading, CardBody, CardFooter, DropdownKebab } from 'patternfly-react';
import { Link } from 'react-router-dom';
import DeleteItemButton from '../../containers/DeleteItemButton';

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

const MobileClientCardViewItem = props => {
  const {
    app,
    app: {
      metadata: { name: appName }
    },
    services,
    builds,
    buildTabEnabled
  } = props;
  return (
    <div className="col-xs-12 col-sm-6 col-md-4 col-lg-3">
      <Card matchHeight /* accented */ className="mobile-client-card">
        <CardHeading>
          <DropdownKebab id={appName} pullRight className="card-dropdown-kebab">
            <DeleteItemButton itemType="app" itemName={appName} item={app} />
          </DropdownKebab>
          <Link to={`/mobileclient/${appName}`}>
            <div className="card-pf-title">
              {appName}
            </div>
          </Link>
        </CardHeading>
        <Link to={`/mobileclient/${appName}`}>
          <CardBody>
            <div className="card-icons">
              {services && services.length > 0 ? getServiceIcons(services) : <div className="service-icon" />}
            </div>
          </CardBody>
          <CardFooter>
            <div className="creation-timestamp">CREATED</div>
            <span className="creation-timestamp">
              <span className="fa fa-globe" /> <Moment format="DD/MM/YYYY">{app.metadata.creationTimestamp}</Moment>
            </span>
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
    </div>
  );
};

export default MobileClientCardViewItem;
