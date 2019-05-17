import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowDocComponent } from './show-doc.component';

describe('ShowDocComponent', () => {
  let component: ShowDocComponent;
  let fixture: ComponentFixture<ShowDocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowDocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
