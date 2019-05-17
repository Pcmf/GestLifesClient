import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprovativosComponent } from './comprovativos.component';

describe('ComprovativosComponent', () => {
  let component: ComprovativosComponent;
  let fixture: ComponentFixture<ComprovativosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComprovativosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComprovativosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
