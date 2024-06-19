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

ARG BASE_DISTRO=bookworm
FROM httpd:2.4.58-$BASE_DISTRO

COPY server/service-proxy.conf /usr/local/apache2/conf/sec-psc/
RUN echo "include conf/sec-psc/service-proxy.conf" >> /usr/local/apache2/conf/httpd.conf
RUN echo "Header unset Access-Control-Allow-Origin" >> /usr/local/apache2/conf/httpd.conf
RUN echo "Header always set Access-Control-Allow-Origin http://localhost:4200" >> /usr/local/apache2/conf/httpd.conf
RUN echo "Header always set Access-Control-Allow-Methods GET,POST,DELETE,PUT,OPTIONS" >> /usr/local/apache2/conf/httpd.conf
