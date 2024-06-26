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
import { ProcessStateWidgetComponent } from '../../../shared/process-state-widget/process-state-widget.component';

@Component({
  selector: 'app-etat-processus',
  standalone: true,
  imports: [ProcessStateWidgetComponent],
  templateUrl: './etat-processus.component.html',
  styleUrl: './etat-processus.component.scss'
})
export class EtatProcessusComponent {}
