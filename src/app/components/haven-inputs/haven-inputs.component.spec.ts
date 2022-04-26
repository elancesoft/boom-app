import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HavenInputsComponent } from './haven-inputs.component';

describe('HavenInputsComponent', () => {
  let component: HavenInputsComponent;
  let fixture: ComponentFixture<HavenInputsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HavenInputsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HavenInputsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
