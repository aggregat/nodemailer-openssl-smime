ARG BUILD_PYTHON_VERSION=3.11
ARG BUILD_NODE_VERSION=18
ARG RUN_NODE_VERSION=14

###################################################################################################
FROM nikolaik/python-nodejs:python${BUILD_PYTHON_VERSION}-nodejs${BUILD_NODE_VERSION}-alpine AS buildstage

RUN apk add --update-cache \
  build-base \
  && rm -rf /var/cache/apk/*

WORKDIR /usr/src/app/
COPY . .

RUN npm ci
RUN npm run build

CMD ["cp", "-rfv", "/usr/src/app/prebuilds/linux-x64/", "/mnt/prebuilds/"]
