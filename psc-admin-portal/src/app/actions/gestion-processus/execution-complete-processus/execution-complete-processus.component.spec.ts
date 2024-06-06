import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutionCompleteProcessusComponent } from './execution-complete-processus.component';

describe('ExecutionCompleteProcessusComponent', () => {
  let component: ExecutionCompleteProcessusComponent;
  let fixture: ComponentFixture<ExecutionCompleteProcessusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExecutionCompleteProcessusComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExecutionCompleteProcessusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
