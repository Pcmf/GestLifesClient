import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CapCompComponent } from './cap-comp.component';

describe('CapCompComponent', () => {
  let component: CapCompComponent;
  let fixture: ComponentFixture<CapCompComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CapCompComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CapCompComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
