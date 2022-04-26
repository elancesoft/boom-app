import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyHaveMortgageComponent } from './policy-have-mortgage.component';

describe('PolicyHaveMortgageComponent', () => {
  let component: PolicyHaveMortgageComponent;
  let fixture: ComponentFixture<PolicyHaveMortgageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolicyHaveMortgageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyHaveMortgageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
