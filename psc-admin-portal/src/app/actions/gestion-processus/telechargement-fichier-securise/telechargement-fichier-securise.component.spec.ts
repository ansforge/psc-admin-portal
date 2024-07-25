import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelechargementFichierSecuriseComponent } from './telechargement-fichier-securise.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('TelechargementFichierSecuriseComponent', () => {
  let component: TelechargementFichierSecuriseComponent;
  let fixture: ComponentFixture<TelechargementFichierSecuriseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TelechargementFichierSecuriseComponent, HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TelechargementFichierSecuriseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
