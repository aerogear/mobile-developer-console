#!/usr/bin/env bash

set -o errexit
set -o nounset
set -o pipefail

vendor/k8s.io/code-generator/generate-groups.sh \
deepcopy \
github.com/aerogear/mobile-developer-console/pkg/generated \
github.com/aerogear/mobile-developer-console/pkg/apis \
aerogear:v1alpha1 \
--go-header-file "./tmp/codegen/boilerplate.go.txt"
