import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionProcessusComponent } from './gestion-processus.component';

describe('GestionProcessusComponent', () => {
  let component: GestionProcessusComponent;
  let fixture: ComponentFixture<GestionProcessusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionProcessusComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GestionProcessusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
