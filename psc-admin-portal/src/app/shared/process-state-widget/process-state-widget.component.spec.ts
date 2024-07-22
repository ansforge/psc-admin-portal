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

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessStateWidgetComponent } from './process-state-widget.component';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {ProcessState, processStateEnum} from './process.model';
import {ProcessService} from './process.service';
import {Extract} from '../../api/extract.service';
import {AmarConnectorService} from '../../api/amar-connector.service';

describe('ProcessStateWidgetComponent', () => {
  let component: ProcessStateWidgetComponent;
  let fixture: ComponentFixture<ProcessStateWidgetComponent>;
  let processService: ProcessService;
  let extractService: Extract;
  let amarConnectorService: AmarConnectorService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProcessStateWidgetComponent,HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcessStateWidgetComponent);
    TestBed.inject(HttpClient);
    component = fixture.componentInstance;
    processService = TestBed.inject(ProcessService);
    extractService = TestBed.inject(Extract);
    amarConnectorService = TestBed.inject(AmarConnectorService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('step should be checked when processState is not null and all conditions are met', () => {
    const stepProcessState: ProcessState = processStateEnum[2];

    component.processState = [processStateEnum[3]];

    const result: boolean = component.shouldStepBeChecked(stepProcessState);

    expect(result).toBe(true);
  });

  it('step should not be checked when step is running', () => {
    const stepProcessState: ProcessState = processStateEnum[2];

    component.processState = [processStateEnum[2]];

    const result: boolean = component.shouldStepBeChecked(stepProcessState);

    expect(result).toBe(false);
  });

  it('step should not be checked when process is running a lower state', () => {
    const stepProcessState: ProcessState = processStateEnum[5];

    component.processState = [processStateEnum[4], processStateEnum[6]];

    const result: boolean = component.shouldStepBeChecked(stepProcessState);

    expect(result).toBe(false);
  });

  it('step should not be checked when processState is null', () => {
    const stepProcessState: ProcessState = processStateEnum[2];

    component.processState = null;

    const result: boolean = component.shouldStepBeChecked(stepProcessState);

    expect(result).toBe(false);
  });

  it('should be no current step when processState is null', () => {
    const stepNumber: number = 2;

    component.processState = null;

    const result: boolean = component.isCurrentStep(stepNumber);

    expect(result).toBe(false);
  });

  it('should find current step if step number matches an active processState', () => {
    const stepNumber: number = 4;

    component.processState = [processStateEnum[4], processStateEnum[6]];

    const result: boolean = component.isCurrentStep(stepNumber);

    expect(result).toBe(true);
  });

  it('should be false if step number does not match an active processState', () => {
    const stepNumber: number = 3;

    component.processState = [processStateEnum[4], processStateEnum[6]];

    const result: boolean = component.isCurrentStep(stepNumber);

    expect(result).toBe(false);
  });

});
