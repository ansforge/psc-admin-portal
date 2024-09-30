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

import {ComponentFixture, fakeAsync, flush, TestBed, tick} from '@angular/core/testing';

import {NotificationComponent } from './notification.component';
import {AlertManager} from '../../../../api/alertmanager.service';
import {Subject} from 'rxjs';
import {QueryResult} from '../../../../api/queryResult.model';
import {QueryStatusEnum} from '../../../../api/queryStatus.model';
import {environment} from '../../../../../environments/environment.dev';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('NotificationComponent', () => {
  let component: NotificationComponent;
  let fixture: ComponentFixture<NotificationComponent>;
  let alertManagerService: jasmine.SpyObj<AlertManager>;
  let alertUpdatesSubject: Subject<QueryResult<boolean>>;

  const mockTrueQueryResult: QueryResult<boolean> = {message: '', status: QueryStatusEnum.OK, body: true };
  const mockFalseQueryResult: QueryResult<boolean> = {message: '', status: QueryStatusEnum.OK, body: false };

  beforeEach(async () => {
    alertManagerService = jasmine.createSpyObj('AlertManager', ['hasLoaderAlerts']);

    alertUpdatesSubject = new Subject<QueryResult<boolean>>();

    Object.defineProperty(alertManagerService, 'alertUpdates', {
      get: () => alertUpdatesSubject.asObservable(),
    });

    await TestBed.configureTestingModule({
      imports: [NotificationComponent, HttpClientTestingModule],
      providers: [{ provide: AlertManager, useValue: alertManagerService }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationComponent);
    component = fixture.componentInstance;
    alertManagerService = TestBed.inject(AlertManager) as jasmine.SpyObj<AlertManager>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call hasLoaderAlerts and update $hasNotifications based on response', fakeAsync(() => {
    component.ngOnInit();

    alertUpdatesSubject.next(mockTrueQueryResult)
    tick(environment.UPDATE_PERIOD);
    expect(component.$hasNotifications()).toBe(true);

    alertUpdatesSubject.next(mockFalseQueryResult);
    tick(environment.UPDATE_PERIOD);
    expect(component.$hasNotifications()).toBe(false);

    component.ngOnDestroy();
    flush();
  }));

  it('should stop polling when unsub$ emits', fakeAsync(() => {
    alertUpdatesSubject.next({message: '', status: QueryStatusEnum.OK, body: true });

    component.ngOnInit();

    tick(environment.UPDATE_PERIOD);
    expect(component.$hasNotifications()).toBe(true);

    alertUpdatesSubject.next({message: '', status: QueryStatusEnum.OK, body: false });

    component.unsub$.next();
    component.unsub$.complete();

    tick(environment.UPDATE_PERIOD);
    expect(component.$hasNotifications()).toBe(false);

    component.ngOnDestroy();
    flush();
  }));
});
