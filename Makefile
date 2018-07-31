APP_NAME = mobile-client-service
PKG     = github.com/aerogear/$(APP_NAME)
TOP_SRC_DIRS   = pkg
PACKAGES     ?= $(shell sh -c "find $(TOP_SRC_DIRS) -name \\*_test.go \
                  -exec dirname {} \\; | sort | uniq")
BINARY ?= mobile-client-service

# This follows the output format for goreleaser
BINARY_LINUX_64 = ./dist/linux_amd64/mobile-client-service

RELEASE_TAG ?= $(CIRCLE_TAG)
DOCKER_LATEST_TAG = aerogear/$(APP_NAME):latest
DOCKER_MASTER_TAG = aerogear/$(APP_NAME):master
DOCKER_RELEASE_TAG = aerogear/$(APP_NAME):$(RELEASE_TAG)

.PHONY: setup
setup:
	dep ensure

.PHONY: test
test:
	@echo Running tests:
	@echo $(PACKAGES)
	go test -v -race -cover $(addprefix $(PKG)/,$(PACKAGES))

.PHONY: test-cover
test_cover:
	@echo "mode: count" > coverage-all.out
	GOCACHE=off $(foreach pkg,$(PACKAGES),\
	go test -failfast -tags=integration -coverprofile=coverage.out -covermode=count $(addprefix $(PKG)/,$(pkg)) || exit 1;\
	tail -n +2 coverage.out >> coverage-all.out;)

.PHONY: build
build: setup
	go build -o $(BINARY) ./cmd/api-server/main.go

.PHONY: ui
ui:
	cd ui && npm install && npm run build

.PHONY: serve
serve: build ui
	export STATIC_FILES_DIR=$(CURDIR)/ui/build; ./mobile-client-service -kubeconfig ~/.kube/config

.PHONY: build_linux
build_linux: setup
	env GOOS=linux GOARCH=amd64 go build -o $(BINARY_LINUX_64) ./cmd/api-server/main.go

.PHONY: docker_build
docker_build: build_linux
	docker build -t $(DOCKER_LATEST_TAG) --build-arg BINARY=$(BINARY_LINUX_64) .

.PHONY: docker_build_release
docker_build_release:
	docker build -t $(DOCKER_LATEST_TAG) -t $(DOCKER_RELEASE_TAG) --build-arg BINARY=$(BINARY_LINUX_64) .

.PHONY: docker_build_master
docker_build_master:
	docker build -t $(DOCKER_MASTER_TAG) --build-arg BINARY=$(BINARY_LINUX_64) .

.PHONY: docker_push_release
docker_push_release:
	@docker login --username $(DOCKERHUB_USERNAME) --password $(DOCKERHUB_PASSWORD)
	docker push $(DOCKER_LATEST_TAG)
	docker push $(DOCKER_RELEASE_TAG)
	
.PHONY: docker_push_master
docker_push_master:
	@docker login -u $(DOCKERHUB_USERNAME) -p $(DOCKERHUB_PASSWORD)
	docker push $(DOCKER_MASTER_TAG)