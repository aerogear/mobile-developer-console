#!/bin/bash
MINISHIFT_IP=`minishift ip`
USER_TOKEN=`oc whoami -t`

if [ -z "$MINISHIFT_IP" ]; then
  echo "minishift is not running"
  exit 1
fi

echo "minishift ip is $MINISHIFT_IP"
echo "Use myproject namespace"
oc project myproject
echo "Setup environment variables"
export OPENSHIFT_HOST="$MINISHIFT_IP:8443"
export OPENSHIFT_USER_TOKEN="$USER_TOKEN"
echo "Start server"
npm run start:server &
npm run start