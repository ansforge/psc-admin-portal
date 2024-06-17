/*
 * Copyright © 2022-2024 Agence du Numérique en Santé (ANS) (https://esante.gouv.fr)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

job "psc-admin-portal" {
  datacenters = ["${datacenter}"]
  type = "service"
  namespace = "${nomad_namespace}"
  
  vault {
    policies = ["psc-ecosystem"]
    change_mode = "signal"
    change_signal = "SIGHUP"
  }
  
  group "psc-admin-portal" {
    count = "1"
      
    restart {
      attempts = 3
      delay = "60s"
      interval = "1h"
      mode = "fail"
    }

    update {
      max_parallel = 1
      min_healthy_time = "30s"
      progress_deadline = "5m"
      healthy_deadline = "2m"
    }

    network {
      port "https" {
        to = 443
      }
      port "http" {
        to = 80
      }
    }
      
    task "portal-server" {
      driver = "docker"
      config {
        image = "${artifact.image}:${artifact.tag}"
        ports = ["https"]
      }
  
      resources {
        cpu = 300
        memory = 1024
      }
      
      template {
        data = << EOH
{{ with secret "psc-ecosystem/${nomad_namespace}/admin-portal"}}
PSC_HOST={{Data.data.hostname}}
PROTOCOL={{Data.data.protocol}}
CLIENT_ID={{Data.data.client_id}}
CLIENT_SECRET={{Data.data.client_secret}}
{{end}}
EOF
        destination = secrets/front.env
        env = true
      }

      service {
        name = "$\u007BNOMAD_NAMESPACE\u007D-$\u007BNOMAD_JOB_NAME\u007D"
        tags = ["urlprefix-$\u007BPUBLIC_HOSTNAME\u007D/toggle/"]
        port = "https"
        check {
          type = "http"
          path = "/"
          port = "http"
          interval = "30s"
          timeout = "2s"
          failures_before_critical = 5
        }
      }
    }
  }
}