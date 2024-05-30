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

import { Operations as OperationEnum } from "./pscload.model";

describe('PsLoadService', () => {
  it('All operation codes should be unique', () => {
    let counters=new Map<string,number>();
    for(let operation of OperationEnum) {
      let operationCode: string=''+operation.code;
      let count: number|undefined=counters.get(operationCode);
      if(count){
        counters.set(operationCode,count+1);
      } else{
        counters.set(operationCode,1);
      }
    }
    
    counters.forEach(
      (count: number, key: string) =>  expect(key+':'+count).toBe(key+':'+1)
    );
  });
  
  it('All operation display names should be unique', () => {
    let counters=new Map<string,number>();
    for(let idType of OperationEnum) {
      let idName: string=''+idType.displayName;
      let count: number|undefined=counters.get(idName);
      if(count){
        counters.set(idName,count+1);
      } else{
        counters.set(idName,1);
      }
    }
    
    counters.forEach(
      (count: number, key: string) =>  expect(key+':'+count).toBe(key+':'+1)
    );
  });
});
