import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseRelation } from './course-relation.component';

describe('DemoPageP2Component', () => {
  let component: CourseRelation;
  let fixture: ComponentFixture<CourseRelation>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseRelation ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseRelation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
