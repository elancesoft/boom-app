import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoCoverageInfoComponent } from './demo-coverage-info.component';

describe('DemoPriceInfoComponent', () => {
  let component: DemoCoverageInfoComponent;
  let fixture: ComponentFixture<DemoCoverageInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemoCoverageInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoCoverageInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
