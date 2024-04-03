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

# This scripts builds, then launches, a test container. 

cd $(dirname $0)/..

if [ -z ${CLIENT_ID} ]; then
  echo "Missing CLIENT_ID value in env" >&2
  exit 2
fi

if [ -z ${CLIENT_SECRET} ]; then
  echo "Missing CLIENT_SECRET value in env" >&2
  exit 2
fi

if [ -z ${HOST_ADDRESS} ]; then
  HOST_ADDRESS=127.0.0.2
fi

if [ ! -f scripts/service-addresses.conf ]; then
  cp scripts/service-addresses.conf.in scripts/service-addresses.conf
fi

if [ ! -f scripts/whitelist.conf ]; then
  cat <<EOF> scripts/whitelist.conf
# Add whitelist under there. Each line should be as follows : 
# Require claim SubjectNameID:<idNat>
EOF
fi

if [ $(grep -v '#' scripts/whitelist.conf | wc -l) -eq 0 ]; then
   echo "Empty whitelist in $(pwd)/scripts/whitelist.conf, no access." >&2
   exit 2
fi

docker buildx build . -t sec-psc/portal

if [ $? -eq 0 ]; then
  sudo docker run \
     --publish ${HOST_ADDRESS}:80:80 \
     --rm -e PROTOCOL=http \
     -e HOSTNAME=sec-psc.wom.dev.henix.fr \
     -e PSC_HOST=auth.bas.psc.esante.gouv.fr \
     -e CLIENT_ID=${CLIENT_ID} \
     -e CLIENT_SECRET=${CLIENT_SECRET} \
     -v $(pwd)/scripts/whitelist.conf:/usr/local/apache2/conf/sec-psc/whitelist.conf \
     -v $(pwd)/scripts/service-addresses.conf:/usr/local/apache2/conf/sec-psc/service-addresses.conf \
     --name "sec-psc-portal.test" \
     sec-psc/portal
fi
