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

import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import { AppComponent } from './app.component';
import {of, Subject} from 'rxjs';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let eventsSubject: Subject<NavigationEnd>;

  beforeEach(async () => {
    eventsSubject = new Subject<NavigationEnd>();

    await TestBed.configureTestingModule({
      imports: [AppComponent, HttpClientTestingModule, RouterTestingModule],
      providers: [
      {
        provide: ActivatedRoute,
        useValue: {
          url: of([
            [{path: ''}]
          ])
        }
      },
        {
          provide: Router,
          useValue: {
            events: eventsSubject.asObservable(),
            navigateByUrl: () => {},
            createUrlTree: () => ({}),
            serializeUrl: () => ''
          }
        }
      ]
    }).compileComponents();

  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    // const fixture = TestBed.createComponent(AppComponent);
    // const app = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should render header', () => {
    // const fixture = TestBed.createComponent(AppComponent);
    // fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('header')?.textContent).toBeTruthy();
  });

  it('isHomePage should return true if the current address is "/"', fakeAsync(() => {
    eventsSubject.next(new NavigationEnd(1, '/', '/'));
    tick();
    fixture.detectChanges();
    expect(component.isHomePage()).toBeTrue();
  }));

  it('isHomePage should return true if the current page is "/?ts=timestamp"', fakeAsync(() => {
    eventsSubject.next(new NavigationEnd(1, '/?ts=123456789', '/'));
    tick();
    fixture.detectChanges();
    expect(component.isHomePage()).toBeTrue();
  }));

  it('isHomePage should return false if the current page is not "/" or "/?ts=timestamp"', fakeAsync(() => {
    eventsSubject.next(new NavigationEnd(1, '/other-page', '/'));
    tick();
    fixture.detectChanges();
    expect(component.isHomePage()).toBeFalse();
  }));
});
