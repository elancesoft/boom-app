import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoClaimsComponent } from './demo-claims.component';

describe('DemoClaimsComponent', () => {
  let component: DemoClaimsComponent;
  let fixture: ComponentFixture<DemoClaimsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemoClaimsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoClaimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
