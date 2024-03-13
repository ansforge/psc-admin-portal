# Copyright (C) 2022-2023 Agence du Numérique en Santé (ANS) (https://esante.gouv.fr)
# 
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
# 
#         http://www.apache.org/licenses/LICENSE-2.0
# 
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

ARG BASE_DISTRO=bookworm
FROM node:20.11.1-slim as builder

RUN apt update
RUN apt install -y chromium
RUN useradd -m ci
RUN npm install -g @angular/cli
USER ci
COPY --chown=ci psc-admin-portal /src/portal
WORKDIR /src/portal
RUN npm ci
RUN ng test  --watch=false --no-progress --browsers=ChromeHeadlessNoSandbox
RUN ng build --base-href .

FROM debian:${BASE_DISTRO} as oidc_installer
ARG BASE_DISTRO=bookworm
ARG MOD_OIDC_VERSION=2.4.15.3
ARG MOD_OIDC_PACKAGE_VERSION=${MOD_OIDC_VERSION}-1.${BASE_DISTRO}
ARG OIDC_BASE_URL=https://github.com/OpenIDC/mod_auth_openidc/releases/download
ARG MOD_PACKAGE_NAME=libapache2-mod-auth-openidc_${MOD_OIDC_PACKAGE_VERSION}_amd64.deb
ADD --chown=root ${OIDC_BASE_URL}/v${MOD_OIDC_VERSION}/${MOD_PACKAGE_NAME} /tmp/${MOD_PACKAGE_NAME}
RUN apt update;apt install -y /tmp/${MOD_PACKAGE_NAME};apt-get clean

FROM httpd:2.4.58-$BASE_DISTRO

ARG BASE_DISTRO=bookworm

COPY --from=oidc_installer /usr/lib/apache2/modules/mod_auth_openidc.so /usr/local/apache2/modules/mod_auth_openidc.so
COPY --from=oidc_installer /lib/x86_64-linux-gnu/libcjose.so* /lib/x86_64-linux-gnu/
COPY --from=oidc_installer /lib/x86_64-linux-gnu/libhiredis.so* /lib/x86_64-linux-gnu/
RUN if [ $(ldd /usr/local/apache2/modules/mod_auth_openidc.so | grep "not found" | wc -l) -ne 0 ]; then \
      echo "Missing library for mod_auth_oidc\n $(ldd /usr/local/apache2/modules/mod_auth_openidc.so | grep 'not found')";\
      exit 1;\
    fi
RUN echo "include conf/sec-psc/app.conf" >> /usr/local/apache2/conf/httpd.conf
COPY --chown=root server/*.conf /usr/local/apache2/conf/sec-psc/
COPY --chown=root --from=builder /src/portal/dist/psc-admin-portal/browser /usr/local/apache2/htdocs/portal/ui

