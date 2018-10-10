import React from 'react';
import { Card, CardHeading, CardTitle, CardBody, CardFooter, DropdownKebab } from 'patternfly-react';
import DeleteItemButton from '../../containers/DeleteItemButton';

const getIcon = (appType) => {
  let icon;
  switch (appType) {
    case 'android':
      icon = <span alt="Android" className="fa fa-android" />;
      break;
    case 'cordova':
      icon = <img alt="Cordova" src="/img/cordova.png" />;
      break;
    case 'iOS':
      icon = <span alt="iOS" className="fa fa-apple" />;
      break;
    case 'xamarin':
      icon = <img alt="Xamarin" src="/img/xamarin.svg" />;
      break;
    default:
      break;
  }
  return icon;
};

const getServiceIcons = (services) => {
  const icons = {
    metrics: <img alt="Metrics" className="icon" src="/img/metrics.png" />,
    keycloak: <img alt="Keycloak" className="icon" src="/img/keycloak.png" />,
    push: <img alt="Push" className="icon" src="/img/push.png" />,
    sync: <img alt="Sync" className="icon" src="/img/sync.svg" />,
  };
  return services
    .map(service => <span className="service-icon">{icons[service.type]}</span>);
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
    <Card matchHeight accented className="mobile-client-card">
      <CardHeading>
        {builds && builds.length > 0 && (
          <CardTitle>
            <span className="pficon-ok" >{result.success}</span>
            <span className="pficon-error-circle-o" >{result.failed}</span>
          </CardTitle>
        )}
        <DropdownKebab id={app.metadata.name} className="card-dropdown-kebab">
          <DeleteItemButton itemType="app" itemName={appName} />
        </DropdownKebab>
      </CardHeading>
      <a href={`/mobileclient/${app.metadata.name}`}>
        <CardBody>
          <div className="card-body-icon">
            {getIcon(app.spec.clientType)}
          </div>
          <div className="card-body-title">
            {app.metadata.name}
          </div>
        </CardBody>
        <CardFooter>
          {services && services.length > 0 && (
            <div className="card-footer-icons">
              {getServiceIcons(services)}
            </div>
          )}
        </CardFooter>
      </a>
    </Card>
  );
};

export default MobileClientCardViewItem;
