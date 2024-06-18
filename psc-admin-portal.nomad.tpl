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
        mount {
          type = "bind"
          target = "/usr/local/apache2/conf/sec-psc/whitelist.conf"
          source = "local/whitelist.conf"
          readonly = true
        }
        mount {
          type = "bind"
          target = "/usr/local/apache2/conf/sec-psc/service-addresses.conf"
          source = "local/service-addresses.conf"
          readonly = true
        }
      }
  
      resources {
        cpu = 300
        memory = 1024
      }
      
      template {
        data = <<EOH
{{ with secret "psc-ecosystem/${nomad_namespace}/admin-portal"}}
PSC_HOST={{.Data.data.hostname}}
PROTOCOL={{.Data.data.protocol}}
CLIENT_ID={{.Data.data.client_id}}
CLIENT_SECRET={{.Data.data.client_secret}}
{{end}}
EOH
        destination = "secrets/front.env"
        env = true
      }

      template {
        data = <<EOH
# For each variable, a guard is added 
# so that configuration remains parseable even if services are not found in consul
# The guard is a hack replacing non-existing variable value test 
# for conditional configuration a la IfDefine

Define PS_API_ADDRESS "{{ range service "${nomad_namespace}-psc-api-maj-v2" }}{{.Address}}{{ end }}"
Define TEST_PS_API_ADDRESS{{ range service "${nomad_namespace}-psc-api-maj-v2" }}{{.Address}}{{ end }}
<IfDefine TEST_PS_API_ADDRESS>
  Define PS_API_ADDRESS unknown
</IfDefine>

Define PS_API_PORT {{ range service "${nomad_namespace}-psc-api-maj-v2" }}{{.Port}}{{ end }}
Define TEST_PS_API_PORT{{ range service "${nomad_namespace}-psc-api-maj-v2" }}{{.Port}}{{ end }}
<IfDefine TEST_PS_API_PORT>
  Define PS_API_PORT 00
</IfDefine>

Define TOGGLE_ADDRESS {{ range service "${nomad_namespace}-psc-toggle-manager" }}{{.Address}}{{ end }}
Define TEST_TOGGLE_ADDRESS{{ range service "${nomad_namespace}-psc-toggle-manager" }}{{.Address}}{{ end }}
<IfDefine TEST_TOGGLE_ADDRESS>
  Define TOGGLE_ADDRESS unknown
</IfDefine>

Define TOGGLE_PORT {{ range service "${nomad_namespace}-psc-toggle-manager" }}{{.Port}}{{ end }}
Define TEST_TOGGLE_PORT{{ range service "${nomad_namespace}-psc-toggle-manager" }}{{.Port}}{{ end }}
<IfDefine TEST_TOGGLE_PORT>
  Define TOGGLE_PORT 00
</IfDefine>

Define PSCLOAD_ADDRESS {{ range service "${nomad_namespace}-pscload" }}{{.Address}}{{ end }}
Define TEST_PSCLOAD_ADDRESS{{ range service "${nomad_namespace}-pscload" }}{{.Address}}{{ end }}
<IfDefine TEST_PSCLOAD_ADDRESS>
  Define PSCLOAD_ADDRESS unknown
</IfDefine>

Define PSCLOAD_PORT {{ range service "${nomad_namespace}-pscload" }}{{.Port}}{{ end }}
Define TEST_PSCLOAD_PORT{{ range service "${nomad_namespace}-pscload" }}{{.Port}}{{ end }}
<IfDefine TEST_PSCLOAD_PORT>
  Define PSCLOAD_PORT 00
</IfDefine>

Define PSCEXTRACT_ADDRESS {{ range service "${nomad_namespace}-pscextract" }}{{.Address}}{{ end }}
Define TEST_PSCEXTRACT_ADDRESS{{ range service "${nomad_namespace}-pscextract" }}{{.Address}}{{ end }}
<IfDefine TEST_PSCEXTRACT_ADDRESS>
  Define PSCEXTRACT_ADDRESS unknown
</IfDefine>

Define PSCEXTRACT_PORT {{ range service "${nomad_namespace}-pscextract" }}{{.Port}}{{ end }}
Define TEST_PSCEXTRACT_PORT{{ range service "${nomad_namespace}-pscextract" }}{{.Port}}{{ end }}
<IfDefine TEST_PSCEXTRACT_PORT>
  Define PSCEXTRACT_PORT 00
</IfDefine>

Define ALERT_MANAGER_ADDRESS {{ range service "${nomad_namespace}-psc-alertmanager" }}{{.Address}}{{ end }}
Define TEST_ALERT_MANAGER_ADDRESS{{ range service "${nomad_namespace}-psc-alertmanager" }}{{.Address}}{{ end }}
<IfDefine TEST_ALERT_MANAGER_ADDRESS>
  Define ALERT_MANAGER_ADDRESS unknown
</IfDefine>

Define ALERT_MANAGER_PORT {{ range service "${nomad_namespace}-psc-alertmanager" }}{{.Port}}{{ end }}
Define TEST_ALERT_MANAGER_PORT{{ range service "${nomad_namespace}-psc-alertmanager" }}{{.Port}}{{ end }}
<IfDefine TEST_ALERT_MANAGER_PORT>
  Define ALERT_MANAGER_PORT 00
</IfDefine>

EOH
        destination = "local/service-addresses.conf"
        change_mode = "signal"
        change_signal = "SIGHUP"
      }
      
      template {
        data = <<EOH
{{ with secret "psc-ecosystem/${nomad_namespace}/admin-portal/whitelist" }}
{{range $k, $v := .Data.data }}
# Some rights for {{ $k }}
Require claim SubjectNameID:{{ $v }}
{{ end}}
{{ end }}
EOH
        destination = "local/whitelist.conf"
      }

      service {
        name = "$\u007BNOMAD_NAMESPACE\u007D-$\u007BNOMAD_JOB_NAME\u007D"
        tags = ["urlprefix-$\u007BPSC_HOST\u007D/"]
        port = "http"
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