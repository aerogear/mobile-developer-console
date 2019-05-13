APP_NAME = mobile-developer-console

RELEASE_TAG ?= $(CIRCLE_TAG)
DOCKER_LATEST_TAG = aerogear/$(APP_NAME):latest
DOCKER_MASTER_TAG = aerogear/$(APP_NAME):master
DOCKER_RELEASE_TAG = aerogear/$(APP_NAME):$(RELEASE_TAG)

.PHONY: setup
setup:
	npm install

.PHONY: build
build: setup
	npm run build

.PHONY:
npm-ci:
	npm ci

.PHONY: check-code-style
check-code-style: setup
	npm run build-css && node node_modules/eslint/bin/eslint src/

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
	docker build -t $(DOCKER_LATEST_TAG) -t $(DOCKER_RELEASE_TAG) .

.PHONY: docker_build_master
docker_build_master:
	docker build -t $(DOCKER_MASTER_TAG) .

.PHONY: docker_push_release
docker_push_release:
	@docker login --username $(DOCKERHUB_USERNAME) --password $(DOCKERHUB_PASSWORD)
	docker push $(DOCKER_LATEST_TAG)
	docker push $(DOCKER_RELEASE_TAG)

.PHONY: docker_push_master
docker_push_master:
	@docker login -u $(DOCKERHUB_USERNAME) -p $(DOCKERHUB_PASSWORD)
	docker push $(DOCKER_MASTER_TAG)
