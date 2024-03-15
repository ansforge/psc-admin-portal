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


# This scripts is used to draft license header bumps when needed. It may become
# unneccessary or need drastic chage if we decide that this project becomes 
# a maven module or if we manage to use some angular-native method to perform 
# the same check'n'format duties.
init_wd=$(pwd)
cd $(dirname $0)/..
if [ -f pom.xml ]; then
   echo "A module pom was found, please migrate the license configuration in that pom \
         and remove this script and the license/check-pom.xml file"
fi
cp license/check-pom.xml ./
mvn -f ./check-pom.xml validate license:format
rm ./check-pom.xml
cd ${init_wd}
