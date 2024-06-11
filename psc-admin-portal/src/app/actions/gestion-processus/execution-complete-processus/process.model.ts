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

export class State {
  constructor(public numeroEtape: number,public code: string){
    codeToState.set(this.code.toLowerCase(),this);
  }
}

const codeToState: Map<string,State>=new Map();

export function stateFromCode(code: string) {
  if(codeToState.has(code.toLowerCase())) {
    return codeToState.get(code.toLowerCase());
  } else {
    throw new Error(`No such state code ${code}`);
  }
}

export const processStates: State[]=[
  new State(1,"submitted"),
  new State(1,"readyToExtract"),
  new State(2,"readyToComputeDiff"),
  new State(3,"diffComputed"),
  new State(4,"uploadingChanges"),
  new State(5,"changesApplied"),
  //This last state is synthetic and generated from extract's state.
  new State(6,"messageSend")
]
