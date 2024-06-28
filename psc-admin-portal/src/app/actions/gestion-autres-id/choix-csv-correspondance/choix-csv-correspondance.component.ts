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

import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QueryStatus, QueryStatusEnum } from '../../../api/queryStatus.model';
import { Toggle, IdType, idTypeEnum, CsvFileOperations } from '../../../api/toggle.service';
import { QueryStatusPanelComponent } from '../../../shared/query-status-panel/query-status-panel.component';

@Component({
  selector: 'app-choix-csv-correspondance',
  standalone: true,
  imports: [FormsModule, QueryStatusPanelComponent],
  templateUrl: './choix-csv-correspondance.component.html',
  styleUrl: './choix-csv-correspondance.component.scss'
})
export class ChoixCsvCorrespondanceComponent {
  @Input() title: string = 'Choix csv correspondance';
  @Input() operation!: CsvFileOperations;
  correspondance: { name?: string, data: File | null } | null = null;
  readonly qs: typeof QueryStatusEnum = QueryStatusEnum;

  source: IdType | null = null;
  destination: IdType | null = null;

  queryStatus: QueryStatus | null = null;

  constructor(
    private toggleApi: Toggle
  ) {
  }

  selectFile(event: Event): void {
    const fileSelector: HTMLInputElement = event.currentTarget as HTMLInputElement
    const files: FileList = fileSelector.files as FileList;
    if (files && files.length > 0) {
      this.correspondance = {
        name: files.item(0)?.name,
        data: files.item(0)
      };
    }
  }

  send(): void {
    if (this.source && this.destination && this.correspondance?.data) {
      this.queryStatus = {status: QueryStatusEnum.PENDING, message: "Requête soumise."};
      this.toggleApi.handleOtherIds(this.source, this.destination, this.correspondance?.data, this.operation).subscribe(
        (status: QueryStatus) => this.queryStatus = status
      );
    } else {
      this.queryStatus = {status: QueryStatusEnum.KO, message: "Illegal state : missing data."}
    }
  }

  get destinationOptions(): IdType[] {
    return idTypeEnum;
  }

  get sourceOptions(): IdType[] {
    return idTypeEnum;
  }


  destinationChange(event: IdType) {
    this.destination = event;
  }


  sourceChange(event: IdType) {
    this.source = event;
  }

  uploadReady(): boolean {
    return this.correspondance !== null
      && this.source !== null
      && this.destination !== null;
  }

  forgetStatus() {
    this.queryStatus = null;
  }
}
