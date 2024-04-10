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

${SCRIPT_DIR}/stop_dev_backends.sh

cd ${CODE_BASE_DIR}/psc-ps-api
mvn spring-boot:run -D"spring-boot.run.jvmArguments=-Dserver.port=8080" &
echo $! > ${SCRIPT_DIR}/api.pid

cd ${CODE_BASE_DIR}/psc-toggle-ids/psc-toggle-manager
mvn spring-boot:run -D"spring-boot.run.jvmArguments=-Dserver.port=8081" &
echo $! > ${SCRIPT_DIR}/toggle.pid

cd ${CODE_BASE_DIR}/psc-rass-loader/pscload
mvn spring-boot:run -D"spring-boot.run.jvmArguments=-Dserver.port=8082" &
echo $! > ${SCRIPT_DIR}/psload.pid

cd ${CODE_BASE_DIR}/psc-extract
mvn spring-boot:run -D"spring-boot.run.jvmArguments=-Dserver.port=8083" &
echo $! > ${SCRIPT_DIR}/extract.pid

cd ${OLD_PWD}
