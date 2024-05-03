import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoixCsvCorrespondanceComponent } from './choix-csv-correspondance.component';

describe('ChoixCsvCorrespondanceComponent', () => {
  let component: ChoixCsvCorrespondanceComponent;
  let fixture: ComponentFixture<ChoixCsvCorrespondanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChoixCsvCorrespondanceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChoixCsvCorrespondanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
