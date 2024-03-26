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
echo "Running service reverse-proxy on the ${HOST_ADDRESS} interface set up HOST_ADRESS to override."

if [ ! -f scripts/service-addresses.conf ]; then
  cp scripts/service-addresses.conf.in scripts/service-addresses.conf
fi

docker build . -f devProxy.Dockerfile -t sec-psc/devproxy

if [ $? -eq 0 ]; then
  sudo docker run \
     --publish ${HOST_ADDRESS}:80:80 \
     --rm \
     --name "sec-psc-portal.test" \
     -v $(pwd)/scripts/service-addresses.conf:/usr/local/apache2/conf/sec-psc/service-addresses.conf \
     sec-psc/devproxy
fi
