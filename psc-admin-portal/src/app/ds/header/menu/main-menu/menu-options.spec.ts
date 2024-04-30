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

import { MenuHelper, MenuOption } from "./menu-options";

describe('MenuOptionsModel',() => {
  it('should recognize Accueil', () => {
    expect(MenuHelper.valueOf('')).toBe(MenuOption.Accueil);
  })
  
  it('should recognize Actions', () => {
    expect(MenuHelper.valueOf('actions')).toBe(MenuOption.Actions);
  })
  
  it('should recognize FilesAttente', () => {
    expect(MenuHelper.valueOf('filesAttente')).toBe(MenuOption.FilesAttente);
  })
  
  it('should recognize EtatComposants', () => {
    expect(MenuHelper.valueOf('etatComposants')).toBe(MenuOption.EtatComposants);
  })
  
  it('should recognize InterrogationPs', () => {
    expect(MenuHelper.valueOf('interrogationPs')).toBe(MenuOption.InterrogationPs);
  })
  
  it('should recognize RapportExecution', () => {
    expect(MenuHelper.valueOf('rapportExecution')).toBe(MenuOption.RapportExecution);
  })
  
}
)
