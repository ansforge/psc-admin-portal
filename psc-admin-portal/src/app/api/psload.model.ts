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

export interface PsDiff {
  deleted: string[];
  created: string[];
  updated: string[];
}

export const NO_DIFF: PsDiff = {
  created: [] as string[], 
  deleted: [] as string[], 
  updated: [] as string[]
}

export enum PsLoadState {
  DIFF_COMPUTED = "DiffComputed"
}

export interface PsLoadStatus {
  processId: number;
  createdOn: Date;
  state?: PsLoadState;
  psToCreate?: number;
  psToCreateIds?: string[];
  psToUpdate?: number;
  psToUpdateIds?: string[];
  psToDelete?: number;
  psToDeleteIds?: string[];
  downloadedFileName?: string;
  extractFileName?: string;
  lockedSerializedFileName?: string;
  detailed: boolean;
}