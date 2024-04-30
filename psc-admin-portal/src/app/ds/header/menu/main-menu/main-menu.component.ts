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

import { Component } from '@angular/core';
import { DsPopup } from '../../../ds-popup.component';
import { MenuHelper, MenuOption } from './menu-options';
import { DsService } from '../../../ds.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-menu',
  standalone: true,
  imports: [],
  templateUrl: './main-menu.component.html',
  styleUrl: './main-menu.component.scss'
})
export class MainMenuComponent extends DsPopup{
  Accueil           = MenuOption.Accueil
  Actions           = MenuOption.Actions  
  FilesAttente      = MenuOption.FilesAttente
  InterrogationPs   = MenuOption.InterrogationPs
  RapportExecution  = MenuOption.RapportExecution
  EtatComposants    = MenuOption.EtatComposants
  
  constructor(
      private _ds: DsService,
      private router: Router
    ){
    super(_ds);
  }
  
  onMenuClick(option: MenuOption): void{
    this.router.navigateByUrl(option);
  }
}
