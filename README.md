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

### Distribution history

This ecosystem uses many independant components, some of which live an independant life in distinct repositories.
For each release of `psc-admin-portal`, [the psc-components' distribution  history](https://github.com/ansforge/psc-components/blob/main/DISTRIBUTION.md) 
file will need to be updated with the new version, so that we can keep track of compatible component versions, 
and go back to a previous working distribution if need be.

### License header check

The license header check gets performed as part of each container build. If the check fails,
the container build will fail. If this happens, use the [`license/license-format.sh`](license/license-format.sh)
script to draft the header bump commit. **Always** check the result before committing : the tool mostly works,
but in some corner cases (some partial match with the header with too much difference) it will make invalid change
that needs to be manually fixed.


<a name="runInDev"></a>

### Running the angular application in development mode

#### Prerequisits

1. You need bash and docker, directly or in a linux virtual machine like WSL or VirtualBox.
1. You need to map the `sec-psc.wom.dev.henix.fr` domain name to the interface the proxy will be listening to. The launch script defaults to `127.0.0.2`, but if you need this proxy to listen to a specific interface, set the `HOST_ADDRESS` shell variable before running.
1. You need all **sec-psc** git repositories checked-out in the same directory. For this to work, do **not** working copies need to be checked-out under the default directory name created by git clone.

#### Troubleshooting WSL for use with docker

1. Docker containers won't run in WSL

   1.  First of all, please check that you have WSL2 active (WSL1 does not allow docker to work properly)
   2.  If you do run WSL2, check the docker daemon status with :

       ```bash
       sudo service docker status
       ```

       If the answer is not docker is running, the start it :

       ```bash
       sudo service docker start
       ```

1. Docker containers don't have network access

   This migh result from docker's private subnet in the 172.17.xx.xx colliding with the WSL2 VM's random IP adress if this address is in the 172.17.xx.xx range. To ensure this won't happen, you need to tweak docker's daemon configuration to change its private subnet IP range. If your WSL2 VM runs a debian or dervied distro, follow these steps :

   1. Open the `/etc/default/docker` as admin

      ```bash
      sudo nano /etc/default/docker
      ```

   2. Change the DOCKER_OPT line 

      ```
      #DOCKER_OPTS="--dns 8.8.8.8 --dns 8.8.4.4"
      ```

      to

      ```
      DOCKER_OPTS="----bip 198.168.50.1/24"
      ```

#### Running helper processes

Two helper processes may be run as docker containers :

1. Development proxy

   To be able to run the angular portal in development mode, you need a reverse proxy for service calls.
The mapping to backend processes IP and PORT is defined in the `scripts/service-addresses.conf` file. This file is not committed, but generated from the `scripts/service-addresses.conf.in` file if it does not exist.
Default values are OK if you run backends alongside the proxy container using the script (see [Running backend processes](#runningBackendProcesses)). If this is not your configuration, adjust the IP or PORT variables as you need.

1. Mongodb database for the backends

Both containers can be launched by running the [`scripts/launch_dev_helpers.sh`](scripts/launch_dev_helpers.sh) script.

<a name="runningBackendProcesses"></a>

#### Running backend processes

Launch the [`scripts/launch_dev_backends.sh`](scripts/launch_dev_backends.sh) script.

To stop the backend, launch the [`scripts/stop_dev_backends.sh`](scripts/stop_dev_backends.sh) script.

### Testing the process

After launching development processes (see [above](#runInDev)), processes may be tested using two datasets :

1.  Creation dataset

    This dataset is in the file `src/test/resources/rass-2000-lignes.txt`. To load it:

    1.  first copy the (empty) `target/rass-archive-mock.txt` file created by dev helpers into the `target/pscload_files` directory.
    1.  then copy the `src/test/resources/rass-2000-lignes.txt` file content into the `target/pscload_files/rass-archive-mock.txt` file.
    1.  The process will run all along by itself (no restriction on PS creations)

1.  The complete deletion dataset

    This dataset is the empty rass mock extract created by the dev helpers. To load it :

    1.  Empty the `target/pscload_files` directory
    1.  Launch the process
    1.  Deleting 2000 PS will trigger an alert (which can be bypassed from the gestion des alertes action pane)

## Qualification

To test the process in qualification (cloud) environments, 
make sure the qualification environment can access raw github resources and see [the rass-loader qualification procedure](https://github.com/ansforge/psc-rass-loader?tab=readme-ov-file#qualification).