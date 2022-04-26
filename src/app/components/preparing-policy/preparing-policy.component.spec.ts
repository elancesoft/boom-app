import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreparingPolicyComponent } from './preparing-policy.component';

describe('PreparingPolicyComponent', () => {
  let component: PreparingPolicyComponent;
  let fixture: ComponentFixture<PreparingPolicyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreparingPolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreparingPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
