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

import { Routes } from '@angular/router';
import { AccueilComponent } from './accueil/accueil.component';
import { ActionsComponent } from './actions/actions.component';
import { FilesAttenteComponent } from './files-attente/files-attente.component';
import { InterrogationPsComponent } from './interrogation-ps/interrogation-ps.component';
import { RapportExecutionComponent } from './rapport-execution/rapport-execution.component';
import { EtatComposantsComponent } from './etat-composants/etat-composants.component';
import { MenuOption } from './ds/header/menu/main-menu/menu-options';


export const routes: Routes = [
{path:MenuOption.Accueil,component:AccueilComponent},
{path:MenuOption.Actions,component:ActionsComponent},
{path:MenuOption.FilesAttente,component:FilesAttenteComponent},
{path:MenuOption.InterrogationPs,component:InterrogationPsComponent},
{path:MenuOption.RapportExecution,component:RapportExecutionComponent},
{path:MenuOption.EtatComposants,component:EtatComposantsComponent}
];
