import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowComprovativoComponent } from './show-comprovativo.component';

describe('ShowComprovativoComponent', () => {
  let component: ShowComprovativoComponent;
  let fixture: ComponentFixture<ShowComprovativoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowComprovativoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowComprovativoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
