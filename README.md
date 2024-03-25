<!--

    Copyright © 2022-2024 Agence du Numérique en Santé (ANS) (https://esante.gouv.fr)

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.

-->
# PscAdminPortal

Administration portal for sec-psc.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.2.2.

## Development

### License header check

The license header check gets performed as part of each container build. If the check fails,
the container build will fail. If this happens, use the [`license/license-format.sh`](license/license-format.sh)
script to draft the header bump commit. **Always** check the result before committing : the tool mostly works,
but in some corner cases (some partial match with the header with too much difference) it will make invalid change
that needs to be manually fixed.

### Running the angular application in development mode

#### Prerequisits

1. You need bash and docker, directly or in a linux virtual machine like WSL or VirtualBox.
1. You need to map the `sec-psc.wom.dev.henix.fr` domain name to the interface the proxy will be listening to. The launch script defaults to `127.0.0.2`, but if you need this proxy to listen to a specific interface, set the `HOST_ADDRESS` shell variable before running.
1. You need all **sec-psc** git repositories checked-out in the same directory. For this to work, do **not** working copies need to be checked-out under the default directory name created by git clone.

#### Running the proxy

To be able to run the angular portal in development mode, you need a reverse proxy for service calls.
This proxy can be launched by running the [`scripts/launch_dev_proxy.sh`](scripts/launch_dev_proxy.sh) script.

#### Running backend processes

Launch the [`scripts/launch_dev_backends.sh`](scripts/launch_dev_backends.sh) script.

To stop the backend, launch the [`scripts/launch_dev_backends.sh`](scripts/stop_dev_backends.sh) script.