import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyMortgageInfoComponent } from './policy-mortgage-info.component';

describe('PolicyMortgageInfoComponent', () => {
  let component: PolicyMortgageInfoComponent;
  let fixture: ComponentFixture<PolicyMortgageInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolicyMortgageInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyMortgageInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
