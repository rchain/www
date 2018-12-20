##
## rsong-org
## create and publishes rsong.org docker image
##

VERSION=v1.0
APP_NAME=rsong
ORG=rchain
IMAGE=$(DOCKER_USER)/$(APP_NAME)
# IMAGE=$(ORG)/$(APP_NAME)
_TAG = git rev-parse --short HEAD
TAG=$(VERSION)-$(SHORT_SHA)

BIN=node_modules/.bin
GULP=$(BIN)/gulp

login:
	@docker login -u "$(DOCKER_USER)" -p "$(DOCKER_PASS)"

install: login
	$(NODE) npm install 

build: install
	$(NODE) $(GULP) 
dist: build
	$(BIN)/hugo

tag:
	echo $(_TAG)
	git rev-parse --short HEAD
build_image:  dist
	docker build -t $(IMAGE) .

tag_image: build_image
	docker tag $(IMAGE)  $(IMAGE):$(TAG)
	docker tag $(IMAGE) $(IMAGE):latest

publish: tag_image
	docker push $(IMAGE):$(TAG)
	docker push $(IMAGE):latest

.DEFAULT_GOAL :=publish
