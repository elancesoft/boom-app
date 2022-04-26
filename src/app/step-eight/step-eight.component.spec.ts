import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StepEightComponent } from './step-eight.component';

describe('StepEightComponent', () => {
  let component: StepEightComponent;
  let fixture: ComponentFixture<StepEightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StepEightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StepEightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

/*comment*/
