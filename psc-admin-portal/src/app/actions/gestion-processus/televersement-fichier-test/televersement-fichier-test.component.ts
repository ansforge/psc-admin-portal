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

import {Component, Input} from '@angular/core';
import {QueryStatusPanelComponent} from '../../../shared/query-status-panel/query-status-panel.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {QueryStatus, QueryStatusEnum} from '../../../api/queryStatus.model';
import {Extract} from '../../../api/extract.service';

@Component({
  selector: 'app-televersement-fichier-test',
  standalone: true,
  imports: [
    QueryStatusPanelComponent,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './televersement-fichier-test.component.html',
  styleUrl: './televersement-fichier-test.component.scss'
})
export class TeleversementFichierTestComponent {
  @Input()
  title: string = 'Importer un fichier de test';
  fichierTest: {name?: string,data: File|null}|null = null;
  readonly qs: typeof QueryStatusEnum=QueryStatusEnum;

  queryStatus: QueryStatus|null = null;

  constructor(
    private extractService: Extract
  ){}

  selectFile(event: Event): void {
    const fileSelector: HTMLInputElement = event.currentTarget as HTMLInputElement
    const files: FileList = fileSelector.files as FileList;
    if(files && files.length > 0) {
      this.fichierTest = {
        name: files.item(0)?.name,
        data: files.item(0)
      };
    }
  }

  send(): void {
    if(this.fichierTest?.data) {
      this.queryStatus={status: QueryStatusEnum.PENDING,message: "Requête soumise."};
      this.extractService.uploadTestFile(this.fichierTest?.data).subscribe(
        (status: QueryStatus) => this.queryStatus=status
      );
    } else {
      this.queryStatus={status: QueryStatusEnum.KO, message: "Illegal state : missing data."}
    }
  }

  uploadReady(): boolean {
    return this.fichierTest!==null;
  }
}
