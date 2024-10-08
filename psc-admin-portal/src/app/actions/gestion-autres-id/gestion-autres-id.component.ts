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
import { ChoixCsvCorrespondanceComponent } from './choix-csv-correspondance/choix-csv-correspondance.component';
import {CsvFileOperations} from '../../api/toggle.service';

@Component({
  selector: 'app-toggle',
  standalone: true,
  imports: [ChoixCsvCorrespondanceComponent],
  templateUrl: './gestion-autres-id.component.html',
  styleUrl: './gestion-autres-id.component.scss'
})
export class GestionAutresIdComponent {

    protected readonly CsvOperationsModel = CsvFileOperations;
}
