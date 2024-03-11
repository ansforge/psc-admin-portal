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
RUN ng build

FROM httpd:2.4.58-bookworm
COPY --chown=root --from=builder /src/portal/dist/psc-admin-portal/browser /usr/local/apache2/htdocs
COPY angular_htaccess /usr/local/apache2/htdocs/.htaccess
