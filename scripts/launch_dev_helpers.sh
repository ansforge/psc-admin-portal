#!/bin/bash
#
# Copyright © 2022-2024 Agence du Numérique en Santé (ANS) (https://esante.gouv.fr)
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

# This script enables tests from IDE configuration (angular and necessary services
# run from IDE with the necessary revers-proxy configuration to enable service call by
# the angular front indevelopment mode.

. $(dirname $0)/backend_setup.sh

cd $(dirname $0)/..
touch scripts/dev.cfg
. scripts/dev.cfg

if [ -z ${HOST_ADDRESS} ]; then
  HOST_ADDRESS=127.0.0.2
fi
echo "Running service reverse-proxy and mongodb on the ${HOST_ADDRESS} interface add HOST_ADDRESS in scripts/dev.cfg to override."

if [ ! -f scripts/service-addresses.conf ]; then
  cp scripts/service-addresses.conf.in scripts/service-addresses.conf
elif [ ! $(grep Define scripts/service-addresses.conf.in| wc -l) -eq $(grep Define scripts/service-addresses.conf| wc -l) ]; then
  echo "The service-addresses.conf and service-addresses.conf.in do not have the same number of Defines. You need to check." >&2
  exit 2;
fi


if [ -z ${DOCKER_GATEWAY} ]; then
  export DOCKER_GATEWAY=172.17.0.1
fi
echo "Linking containers through docker gateway ${DOCKER_GATEWAY} interface add DOCKER_GATEWAY in scripts/dev.cfg to override."
sed -i -e "s/172\.17\.0\.1/${DOCKER_GATEWAY}/g" scripts/service-addresses.conf

sudo docker buildx build . -f devProxy.Dockerfile -t sec-psc/devproxy

if [ $? -eq 0 ]; then
  if [ $(docker ps -a | grep "sec-psc-mongo" | wc -l) -eq 0 ]; then
    sudo docker run \
      --detach \
      --publish ${HOST_ADDRESS}:27017:27017 \
      --name "sec-psc-mongo" \
      mongo:latest
  else
    sudo docker start sec-psc-mongo
  fi

  if [ $(docker ps -a | grep "sec-psc-prometheus" | wc -l) -eq 0 ]; then
    sudo docker run \
      --detach \
      --publish ${DOCKER_GATEWAY}:9090:9090 \
      --name sec-psc-prometheus \
      -v $(pwd)/scripts/prometheus.yml:/prometheus.yml \
      -v $(pwd)/scripts/prometheus-rules.yml:/rules.yml \
      prom/prometheus:v2.51.0 \
      --web.listen-address=0.0.0.0:9090 \
      --log.level=debug \
      --config.file=/prometheus.yml
  else
    sudo docker start sec-psc-prometheus
  fi

  if [ $(docker ps -a | grep "sec-psc-alertmanager" | wc -l) -eq 0 ]; then
    sed -e "s|http://127.0.0.2:5001/|http://${DOCKER_GATEWAY}:${RASS_LOAD_PORT}/pscload/v2/process/continue|g" $(pwd)/scripts/alertmanager.yml > $(pwd)/target/alertmanager.yml
    sudo docker run \
      --detach \
      --publish ${DOCKER_GATEWAY}:9093:9093 \
      --name sec-psc-alertmanager \
      -v $(pwd)/target/alertmanager.yml:/etc/alertmanager/alertmanager.yml \
      prom/alertmanager:v0.27.0 \
      --config.file=/etc/alertmanager/alertmanager.yml \
      --web.external-url=http://sec-psc.wom.dev.henix.fr/ \
      --cluster.advertise-address=${DOCKER_GATEWAY}:9093
  else
    sudo docker start sec-psc-alertmanager
  fi

  if [ ! -f $(pwd)/target/rass-archive-mock.zip ]; then
    mkdir -p $(pwd)/target
    touch $(pwd)/target/rass-archive-mock.txt
    (cd $(pwd)/target/;zip rass-archive-mock.zip rass-archive-mock.txt)
  fi

  if [ $(docker ps -a | grep "sec-psc-dev-rass-mock" | wc -l) -eq 0 ]; then
    sudo docker run \
      --detach \
      --publish ${HOST_ADDRESS}:9094:80 \
      --name "sec-psc-dev-rass-mock" \
      -v $(pwd)/target/rass-archive-mock.zip:/usr/local/apache2/htdocs/rass-archive-mock.zip \
      -v $(pwd)/scripts/rass-mock/httpd.conf:/usr/local/apache2/conf/httpd.conf \
      httpd:2.4.58-bookworm
  else
    sudo docker start sec-psc-dev-rass-mock
  fi

  sudo docker run \
     --publish ${HOST_ADDRESS}:80:80 \
     --rm \
     --name "sec-psc-portal.test" \
     -v $(pwd)/scripts/service-addresses.conf:/usr/local/apache2/conf/sec-psc/service-addresses.conf \
     sec-psc/devproxy
fi
