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

export enum MenuOption {
  Accueil          = '',
  Actions          = 'actions',
  FilesAttente     = 'filesAttente',
  InterrogationPs  = 'interrogationPs',
  RapportExecution = 'rapportExecution',
  EtatComposants   = 'etatComposants'
}
export class MenuHelper {

  static enumKeys<O extends Object, K extends keyof O = keyof O>(obj: O):K[] {
    return Object.keys(obj).filter(k => Number.isNaN(+k)) as K[];
  }
  
  static valueOf(code: string): MenuOption|null {
    var result: MenuOption|null=null;
    for(const option of MenuHelper.enumKeys(MenuOption)) {
      if(MenuOption[option]===code) {
        result=MenuOption[option];
      }
    }
    return result;
  }
}
