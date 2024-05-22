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

cd $(dirname $0)/..

if [ -z ${HOST_ADDRESS} ]; then
  HOST_ADDRESS=127.0.0.2
fi
echo "Running service reverse-proxy and mongodb on the ${HOST_ADDRESS} interface set up HOST_ADRESS to override."

if [ ! -f scripts/service-addresses.conf ]; then
  cp scripts/service-addresses.conf.in scripts/service-addresses.conf
elif [ ! $(grep Define scripts/service-addresses.conf.in| wc -l) -eq $(grep Define scripts/service-addresses.conf| wc -l) ]; then
  echo "The service-addresses.conf and service-addresses.conf.in do not have the same number or Defines. You need to check." >&2
  exit 2;
fi

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
      --publish ${HOST_ADDRESS}:9090:9090 \
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
    sudo docker run \
      --detach \
      --publish 172.17.0.1:9093:9093 \
      --name sec-psc-alertmanager \
      prom/alertmanager:v0.27.0 \
      --config.file=/etc/alertmanager/alertmanager.yml \
      --web.external-url=http://sec-psc.wom.dev.henix.fr/
  else
    sudo docker start sec-psc-alertmanager
  fi

  sudo docker run \
     --publish ${HOST_ADDRESS}:80:80 \
     --rm \
     --name "sec-psc-portal.test" \
     -v $(pwd)/scripts/service-addresses.conf:/usr/local/apache2/conf/sec-psc/service-addresses.conf \
     sec-psc/devproxy
fi
