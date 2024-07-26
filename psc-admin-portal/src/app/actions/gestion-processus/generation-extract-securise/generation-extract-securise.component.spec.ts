import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerationExtractSecuriseComponent } from './generation-extract-securise.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {Extract} from '../../../api/extract.service';
import {QueryResult} from '../../../api/queryResult.model';
import {QueryStatusEnum} from '../../../api/queryStatus.model';
import {of} from 'rxjs';

describe('GenerationExtractSecuriseComponent', () => {
  let component: GenerationExtractSecuriseComponent;
  let fixture: ComponentFixture<GenerationExtractSecuriseComponent>;
  let mockExtractService: jasmine.SpyObj<Extract>;

  beforeEach(async () => {
    mockExtractService = jasmine.createSpyObj('ExtractService', ['generateSecureFile']);

    await TestBed.configureTestingModule({
      imports: [GenerationExtractSecuriseComponent, HttpClientTestingModule],
      providers: [
        { provide: Extract, useValue: mockExtractService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerationExtractSecuriseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set executionStatus and build statusMessage based on the service response', () => {
    const mockResponse: QueryResult<any> = {
      status: QueryStatusEnum.KO,
      message: 'Error occurred'
    };

    mockExtractService.generateSecureFile.and.returnValue(of(mockResponse));

    component.generateFile();

    expect(component.executionStatus).toEqual(mockResponse);
    expect(component.statusMessage).toBe(
      'Échec du téléchargement de l\'extrait, une erreur est survenue : ' + mockResponse.message
    );
  });

  it('should set statusMessage to successful response message if status is OK', () => {
    const mockResponse: QueryResult<any> = {
      status: QueryStatusEnum.OK,
      message: 'Download started'
    };

    mockExtractService.generateSecureFile.and.returnValue(of(mockResponse));

    component.generateFile();

    expect(component.executionStatus).toEqual(mockResponse);
    expect(component.statusMessage).toBe(mockResponse.message);
  });
});
