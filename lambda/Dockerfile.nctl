#!/bin/bash
FROM amazon/aws-lambda-nodejs:18
RUN yum -y update && yum -y install unzip && yum clean all

RUN curl -LO https://dl.nirmata.io/nctl/nctl_4.2.1-rc.7/nctl_4.2.1-rc.7_linux_amd64.zip && unzip nctl*.zip && mv nctl /bin
RUN chown -R root:root /bin/nctl

COPY ./src/package*.json ./
COPY ./src/app-nctl.js ./app.js
RUN npm install && npm install -g js-yaml

RUN mkdir /policies
COPY ./policies/*.yaml /policies/

ENV HOME=/tmp
ENV RUN_COMMAND=nctl
ENV NPM_TOKEN=null
ENV NPM_USER=null

CMD [ "app.handler" ]
