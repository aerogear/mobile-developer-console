#!/bin/bash
MINISHIFT_STATUS=`minishift status | head -1 | awk -F: '/ /{gsub(/ /, "", $2); print $2}'`
if [ "$MINISHIFT_STATUS" == "Stopped" ]; then
  echo "minishift is not running"
  exit 1
fi

MINISHIFT_IP=`minishift ip`
echo "minishift ip is $MINISHIFT_IP"
oc login "$MINISHIFT_IP:8443" --username=developer --password=developer --insecure-skip-tls-verify=true
USER_TOKEN=`oc whoami -t`
echo "Use myproject namespace"
oc project myproject
echo "Setup environment variables"
export OPENSHIFT_HOST="$MINISHIFT_IP:8443"
export OPENSHIFT_USER_TOKEN="$USER_TOKEN"
export ENABLE_BUILD_TAB="false"
echo "Start local development server..."
npm run start:server &
npm run start:client