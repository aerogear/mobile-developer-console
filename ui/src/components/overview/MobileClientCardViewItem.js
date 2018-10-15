import React from 'react';
import { Card, CardHeading, CardTitle, CardBody, CardFooter, DropdownKebab } from 'patternfly-react';
import { Link } from 'react-router-dom';
import DeleteItemButton from '../../containers/DeleteItemButton';
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

const getBuildCounts = (builds) => {
  const result = { success: 0, failed: 0 };
  builds.forEach((b) => {
    if (b.status === 'success') {
      result.success += 1;
    } else if (b.status === 'failed') {
      result.failed += 1;
    }
  });
  return result;
};

const MobileClientCardViewItem = (props) => {
  const {
    app,
    app: { metadata: { name: appName } },
    services,
    builds,
  } = props;
  const result = getBuildCounts(builds);
  return (
    <div className="col-xs-12 col-sm-6 col-md-4 col-lg-3">
      <Card matchHeight /*accented*/ className="mobile-client-card">
        <CardHeading>
          <DropdownKebab id={app.metadata.name} pullRight className="card-dropdown-kebab">
            <DeleteItemButton itemType="app" itemName={appName} />
          </DropdownKebab>
          {builds && builds.length > 0 && (
            <CardTitle>
              <span><span className="pficon pficon-ok" />{result.success}</span>
              <span><span className="pficon pficon-error-circle-o" />{result.failed}</span>
            </CardTitle>
          )}
        </CardHeading>
        
        <Link to={`/mobileclient/${app.metadata.name}`}>
          <CardBody>
            <div className="card-body-icon">
              <PlatformIcon platform={app.spec.clientType} />
            </div>
            <div className="card-body-title">
              <h1>{app.metadata.name}</h1>
            </div>
          </CardBody>
          <CardFooter>
            {services && services.length > 0 && (
              <div className="card-footer-icons">
                {getServiceIcons(services)}
              </div>
            )}
          </CardFooter>
        </Link>
      </Card>
    </div>
  );
};

export default MobileClientCardViewItem;
