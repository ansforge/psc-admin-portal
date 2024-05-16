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

if [ -z ${OLD_PWD} ]; then
  OLD_PWD=$(pwd)
  SCRIPT_DIR=$(dirname $0)
  cd $SCRIPT_DIR
  SCRIPT_DIR=$(pwd)
  CODE_BASE_DIR=${SCRIPT_DIR}/../..
fi

export API_PORT=8080
