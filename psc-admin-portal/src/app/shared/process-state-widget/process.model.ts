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

/**
 * Model for process state data.
 */
export class ProcessState {
  constructor(public numeroEtape: number,public code: string){
    codeToState.set(this.code.toLowerCase(),this);
  }
}

const codeToState: Map<string,ProcessState>=new Map();

/**
 * Decoding logic to retrieve process state from underlying partial states.
 */
export function stateFromCode(code: string) {
  if(codeToState.has(code.toLowerCase())) {
    return codeToState.get(code.toLowerCase());
  } else {
    throw new Error(`No such state code ${code}`);
  }
}

/**
 * Synthetic process state model based on the pscload (RASS laoder), psc-extract and AMAR message queue states.
 */
export const processStateEnum: ProcessState[]=[
  new ProcessState(1,"submitted"),
  new ProcessState(1,"readyToExtract"),
  new ProcessState(2,"readyToComputeDiff"),
  new ProcessState(3,"diffComputed"),
  new ProcessState(4,"uploadingChanges"),
  new ProcessState(5,"changesApplied"),
  new ProcessState(6,"messageSend")
]
