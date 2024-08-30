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

import {CommonModule} from '@angular/common';
import {Component, OnDestroy, OnInit, signal, WritableSignal} from '@angular/core';
import {AlertManager} from '../../../../api/alertmanager.service';
import {interval, Subject, switchMap, takeUntil} from 'rxjs';
import {environment} from '../../../../../environments/environment.dev';
import {QueryResult} from '../../../../api/queryResult.model';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent implements OnInit, OnDestroy {
  readonly unsub$: Subject<void> = new Subject<void>();

  $hasNotifications: WritableSignal<boolean> = signal<boolean>(false);

  constructor(private alertManager: AlertManager) {
  }

  ngOnInit(): void {
    interval(environment.UPDATE_PERIOD).pipe(
      takeUntil(this.unsub$),
      switchMap(() => this.alertManager.hasLoaderAlerts())
    ).subscribe((result: QueryResult<boolean>) => {
      if (result.body) {
        this.$hasNotifications.set(result.body);
      } else {
        this.$hasNotifications.set(false);
      }
    });
  }

  ngOnDestroy() {
    this.unsub$.next();
    this.unsub$.complete();
  }
}
