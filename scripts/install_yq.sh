#!/usr/bin/env bash

cd "$(dirname "$0")" || exit 1

source=""

if [[ "$OSTYPE" == "linux-gnu" ]]
then
    source="https://github.com/mikefarah/yq/releases/download/2.2.1/yq_linux_amd64"
elif [[ "$OSTYPE" == "darwin"* ]]
then
    source="https://github.com/mikefarah/yq/releases/download/2.2.1/yq_darwin_amd64"
else
    echo "Error: could not detect os system type to download yq binary"
    echo "Download suitable yq binary from https://github.com/mikefarah/yq/releases/tag/2.2.1 and add it to your path"
    exit 1
fi

wget $source -O yq
chmod +x ./yq
sudo mv ./yq /usr/local/bin/
echo "yq binary downloaded and moved to /usr/local/bin/"