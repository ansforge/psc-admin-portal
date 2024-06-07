import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryStatusPanelComponent } from './query-status-panel.component';

describe('QueryStatusPanelComponent', () => {
  let component: QueryStatusPanelComponent;
  let fixture: ComponentFixture<QueryStatusPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QueryStatusPanelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QueryStatusPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
