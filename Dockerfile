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

# This first stage will package the portal angular application for use in this server.
ARG BASE_DISTRO=bookworm
FROM maven:3.9 AS checker

COPY . /src
WORKDIR /src
RUN mv license/check-pom.xml ./pom.xml
RUN mvn -Dlicense.current.year=$(git log -1 --format="%at" | xargs -I{} date -d @{} +%Y) license:check
RUN touch /.sourceCheck

FROM node:20.11.1-slim AS builder
ARG BASE_DISTRO=bookworm

RUN apt update
RUN apt install -y chromium
RUN useradd -m ci
RUN npm install -g @angular/cli
USER ci
COPY --chown=ci psc-admin-portal /src/portal
WORKDIR /src/portal
RUN npm ci
RUN ng test  --watch=false --no-progress --browsers=ChromeHeadlessNoSandbox
RUN ng build --base-href /portal/ui/

# This stage will get the OIDC module package, install it to grab its files.
FROM debian:${BASE_DISTRO} AS oidc_installer
ARG BASE_DISTRO=bookworm
ARG MOD_OIDC_VERSION=2.4.16.3
ARG MOD_OIDC_PACKAGE_VERSION=${MOD_OIDC_VERSION}-1.${BASE_DISTRO}
ARG OIDC_BASE_URL=https://github.com/OpenIDC/mod_auth_openidc/releases/download
ARG MOD_PACKAGE_NAME=libapache2-mod-auth-openidc_${MOD_OIDC_PACKAGE_VERSION}_amd64.deb
ADD --chown=root ${OIDC_BASE_URL}/v${MOD_OIDC_VERSION}/${MOD_PACKAGE_NAME} /tmp/${MOD_PACKAGE_NAME}
RUN apt update;apt install -y /tmp/${MOD_PACKAGE_NAME};apt-get clean

FROM httpd:2.4.58-$BASE_DISTRO

# This is the stage that builds the actual server image
ARG BASE_DISTRO=bookworm

# Installing the OIDC module
COPY --from=oidc_installer /usr/lib/apache2/modules/mod_auth_openidc.so /usr/local/apache2/modules/mod_auth_openidc.so
COPY --from=oidc_installer /lib/x86_64-linux-gnu/libcjose.so* /lib/x86_64-linux-gnu/
COPY --from=oidc_installer /lib/x86_64-linux-gnu/libhiredis.so* /lib/x86_64-linux-gnu/
RUN if [ $(ldd /usr/local/apache2/modules/mod_auth_openidc.so | grep "not found" | wc -l) -ne 0 ]; then \
      echo "Missing library for mod_auth_oidc\n $(ldd /usr/local/apache2/modules/mod_auth_openidc.so | grep 'not found')";\
      exit 1;\
    fi

# Installing configuration files
RUN echo "ServerName \${HOSTNAME}" >> /usr/local/apache2/conf/httpd.conf
RUN echo "include conf/sec-psc/app.conf" >> /usr/local/apache2/conf/httpd.conf
COPY --chown=root server/*.conf /usr/local/apache2/conf/sec-psc/

#Installing the angular application
COPY --chown=root psc-admin-portal/src/favicon.ico /usr/local/apache2/htdocs/
COPY --chown=root server/*.html /usr/local/apache2/htdocs/
COPY --chown=root server/*.js /usr/local/apache2/htdocs/
COPY --chown=root psc-admin-portal/src/img /usr/local/apache2/htdocs/img
COPY --chown=root psc-admin-portal/src/style /usr/local/apache2/htdocs/style
COPY --chown=root psc-admin-portal/src/svg-icons /usr/local/apache2/htdocs/svg-icons
COPY --chown=root --from=builder /src/portal/dist/psc-admin-portal/browser /usr/local/apache2/htdocs/portal/ui
COPY --chown=root --from=checker /.sourceCheck /
COPY --chown=root server/pwd.sh /usr/local/sbin/pwd.sh
RUN chmod a+x /usr/local/sbin/pwd.sh
