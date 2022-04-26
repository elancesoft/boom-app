import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoPageP2Component } from './demo-page-p2.component';

describe('DemoPageP2Component', () => {
  let component: DemoPageP2Component;
  let fixture: ComponentFixture<DemoPageP2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemoPageP2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoPageP2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
