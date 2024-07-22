///
/// Copyright © 2022-2024 Agence du Numérique en Santé (ANS) (https://esante.gouv.fr)
///
/// Licensed under the Apache License, Version 2.0 (the "License");
/// you may not use this file except in compliance with the License.
/// You may obtain a copy of the License at
///
///     http://www.apache.org/licenses/LICENSE-2.0
///
/// Unless required by applicable law or agreed to in writing, software
/// distributed under the License is distributed on an "AS IS" BASIS,
/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
/// See the License for the specific language governing permissions and
/// limitations under the License.
///

import {Injectable} from "@angular/core";
import {Observable, map, switchMap} from "rxjs";
import {ProcessState, stateFromCode} from "./process.model";
import {Pscload} from "../../api/pscload.service";
import {QueryResult} from "../../api/queryResult.model";
import {PscLoadStatus} from "../../api/pscload.model";
import {QueryStatusEnum} from "../../api/queryStatus.model";
import {Extract} from '../../api/extract.service';
import {AmarConnectorService} from '../../api/amar-connector.service';

@Injectable({providedIn: "root"})
export class ProcessService {

  constructor(private pscLoad: Pscload,
              private extractService: Extract,
              private amarConnectorService: AmarConnectorService) {
  }

  getProcessState(): Observable<ProcessState[]> {
    return this.pscLoad
      .getPscLoadStatus()
      .pipe(
        map(
          (res: QueryResult<PscLoadStatus | null>) => {
            if (res.status === QueryStatusEnum.OK) {
              const pscloadStatus = res.body as PscLoadStatus | null;
              if (pscloadStatus === null) {
                const body: null = null;
                return {
                  status: QueryStatusEnum.OK,
                  message: 'Pas de processus en cours',
                  body: body
                };
              } else {
                const state = pscloadStatus.state;
                const processState: ProcessState = stateFromCode(state)
                return {
                  status: QueryStatusEnum.OK,
                  message: 'Processus en cours',
                  body: processState
                } as QueryResult<ProcessState | null>;
              }
            } else {
              return {
                status: QueryStatusEnum.KO,
                message: res.message
              } as QueryResult<ProcessState | null>;
            }
          }
        ),
        switchMap((state: QueryResult<ProcessState | null>) => this.extractService.getExtractGenerationState(state)),
        switchMap((activeStates: ProcessState[]) => this.amarConnectorService.getMessageState(activeStates)),
      );
  }
}
