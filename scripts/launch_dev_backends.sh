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

if [ -z PS_API_JDK_HOME ]; then 
  PS_API_JDK_HOME=$JAVA_HOME
fi
JDK_VERSION=$($PS_API_JDK_HOME/bin/java -version 2>&1 | grep -E "(java|openjdk) version \"" | sed -r "s/(java|openjdk) version \"([0-9]+)\..*/\2/g")
if [ $JDK_VERSION -gt 17 ]; then
  echo "With JDK version ${DEFAULT_JDK_VERSION} > 17, psc-ps-api run will fail, please set PS_API_JDK_HOME in dev.cfg"
  exit 2
else
  echo "psc-ps-api run from $PS_API_JDK_HOME ($JDK_VERSION)"
fi

${SCRIPT_DIR}/stop_dev_backends.sh

touch ${SCRIPT_DIR}/dev.cfg
. ${SCRIPT_DIR}/dev.cfg

if [ -z ${HOST_ADDRESS} ]; then
  HOST_ADDRESS=127.0.0.2
fi
echo "Reaching to interface ${HOST_ADDRESS} for mongodb. Add HOST_ADRESS in scripts/dev.cfg to override."

cd ${CODE_BASE_DIR}/psc-ps-api
JAVA_HOME=${PS_API_JDK_HOME} mvn spring-boot:run -Dspring-boot.run.jvmArguments="-Dserver.port=${API_PORT} -Dspring.data.mongodb.host=${HOST_ADDRESS}" &
echo $! > ${SCRIPT_DIR}/api.pid

cd ${CODE_BASE_DIR}/psc-toggle-ids/psc-toggle-manager
JAVA_HOME=${PS_API_JDK_HOME} mvn spring-boot:run -D"spring-boot.run.jvmArguments=-Dserver.port=8081 -Dapi.base.url=http://${HOST_ADDRESS}:${API_PORT}/psc-api-maj/api" &
echo $! > ${SCRIPT_DIR}/toggle.pid

PSCLOAD_FILES_DIR=${SCRIPT_DIR}/../target/pscload_files
if [ ! -d ${PSCLOAD_FILES_DIR} ]; then
  mkdir -p ${PSCLOAD_FILES_DIR}
fi

cd ${CODE_BASE_DIR}/psc-rass-loader/pscload
JAVA_HOME=${PS_API_JDK_HOME} mvn spring-boot:run -D"spring-boot.run.jvmArguments=-Dserver.port=${RASS_LOAD_PORT} -Dserver.servlet.context-path=/pscload/v2 -Dapi.base.url=http://${HOST_ADDRESS}:${API_PORT}/psc-api-maj/api -Dextract.download.url=http://${HOST_ADDRESS}:9094/rass-archive-mock.zip -Duse.x509.auth=false -Dfiles.directory=${PSCLOAD_FILES_DIR}" &
echo $! > ${SCRIPT_DIR}/psload.pid

cd ${CODE_BASE_DIR}/psc-extract
mvn spring-boot:run -D"spring-boot.run.jvmArguments=-Dserver.port=8083" &
echo $! > ${SCRIPT_DIR}/extract.pid

cd ${CODE_BASE_DIR}/psc-amar-connector/async-listener
mvn spring-boot:run -D"spring-boot.run.jvmArguments=-Dserver.port=8084 -Dapi.base.url=http://${HOST_ADDRESS}:${API_PORT}/psc-api-maj/api" &
echo $! > ${SCRIPT_DIR}/amar.pid

cd ${OLD_PWD}
