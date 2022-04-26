import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StepNineComponent } from './step-nine.component';

describe('StepNineComponent', () => {
  let component: StepNineComponent;
  let fixture: ComponentFixture<StepNineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StepNineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StepNineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

/*comment*/
