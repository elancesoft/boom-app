import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreDetailsComponent } from './pre-details.component';

describe('PreDetailsComponent', () => {
  let component: PreDetailsComponent;
  let fixture: ComponentFixture<PreDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
