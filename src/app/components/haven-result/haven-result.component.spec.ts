import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HavenResultComponent } from './haven-result.component';

describe('HavenResultComponent', () => {
  let component: HavenResultComponent;
  let fixture: ComponentFixture<HavenResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HavenResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HavenResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
