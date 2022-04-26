import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyStartDateComponent } from './policy-start-date.component';

describe('PolicyStartDateComponent', () => {
  let component: PolicyStartDateComponent;
  let fixture: ComponentFixture<PolicyStartDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolicyStartDateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyStartDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
