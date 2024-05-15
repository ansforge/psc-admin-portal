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

import { IdType, idTypeEnum } from "./toggle.service";

describe('ToggleService', () => {
  it('All idType ids should be unique', () => {
    let counters=new Map<string,number>();
    for(let idType of idTypeEnum) {
      let idName: string=''+idType.id;
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
  
  it('All idType codes should be unique', () => {
    let counters=new Map<string,number>();
    for(let idType of idTypeEnum) {
      let idCode: string=idType.code;
      let count: number|undefined=counters.get(idCode);
      if(count){
        counters.set(idCode,count+1);
      } else{
        counters.set(idCode,1);
      }
    }
    counters.forEach(
      (count: number, key: string) =>  expect(key+':'+count).toBe(key+':'+1)
    );
  });
})