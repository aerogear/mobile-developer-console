import React, {Component} from 'react';
import {Card, CardHeading, CardTitle, CardBody, CardFooter, DropdownKebab, MenuItem, Icon} from 'patternfly-react';
import DeleteItemButton from '../../containers/DeleteItemButton';

const getIcon = (appType) => {
  var icon;
  switch(appType) {
    case "android":
      icon = <span className="fa fa-android" />;
      break;
    case "cordova":
      icon = <img src="/img/cordova.png" />;
      break;
    case "iOS":
      icon = <span className="fa fa-apple" />;
      break;
    case "xamarin":
      icon = <img src="/img/xamarin.svg" />;
      break;
  }
  return icon;
}

const getServiceIcons = (services) => {
  const icons = {
    "metrics": <img className="icon" src="/img/metrics.png" />,
    "keycloak": <img className="icon" src="/img/keycloak.png" />,
    "push": <img className="icon" src="/img/push.png" />,
    "sync": <img className="icon" src="/img/sync.svg" />
  };
  return (
    services.map((service) => {
      return <span className="service-icon">
        {icons[service.type]}
      </span>
    })
  )
}

const getBuildCounts = (builds) => {
  var result = {success: 0, failed: 0};
  builds.forEach((b) => {
    if (b.status === "success") {
      result.success++;
    } else if(b.status === "failed") {
      result.failed++;
    }
  });
  return result;
}

class MobileClientCardViewItem extends Component {
  render() {
    const {
      app,
      app: { metadata: { name: appName } },
      services,
      builds
    } = this.props;
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
    )
  };
};

export default MobileClientCardViewItem;