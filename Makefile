APP_NAME = mobile-developer-console
SERVER = quay.io
RELEASE_TAG ?= $(CIRCLE_TAG)
DOCKER_LATEST_TAG = ${SERVER}/aerogear/$(APP_NAME):latest
DOCKER_MASTER_TAG = ${SERVER}/aerogear/$(APP_NAME):master
DOCKER_RELEASE_TAG = ${SERVER}/aerogear/$(APP_NAME):$(RELEASE_TAG)

.PHONY: setup
setup:
	npm install

.PHONY: build
build: setup
	npm run build

.PHONY: test
test: setup
	npm run build-css && npm run test

.PHONY:
npm-ci:
	npm ci

.PHONY: check-code-style
check-code-style: setup
	npm run build-css && npm run lint

.PHONY: test-cover
test-cover: npm-ci
	npm run build-css && npm run coverage

.PHONY: serve
serve: build
	npm run start

.PHONY: docker_build
docker_build:
	docker build -t $(DOCKER_LATEST_TAG) .

.PHONY: docker_build_release
docker_build_release:
	docker build -t $(DOCKER_RELEASE_TAG) -t $(DOCKER_LATEST_TAG) .

.PHONY: docker_build_master
docker_build_master:
	docker build -t $(DOCKER_MASTER_TAG) -t $(DOCKER_LATEST_TAG) .

.PHONY: docker_push_release
docker_push_release:
	@docker login --username $(QUAY_USERNAME) --password $(QUAY_PASSWORD) ${SERVER}
	docker push $(DOCKER_RELEASE_TAG)
	docker push $(DOCKER_LATEST_TAG)

.PHONY: docker_push_master
docker_push_master:
	@docker login -u $(QUAY_USERNAME) -p $(QUAY_PASSWORD) ${SERVER}
	docker push $(DOCKER_MASTER_TAG)
	docker push $(DOCKER_LATEST_TAG)
