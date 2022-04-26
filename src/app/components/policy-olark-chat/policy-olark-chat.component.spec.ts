import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyOlarkChatComponent } from './policy-olark-chat.component';

describe('PolicyOlarkChatComponent', () => {
  let component: PolicyOlarkChatComponent;
  let fixture: ComponentFixture<PolicyOlarkChatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolicyOlarkChatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyOlarkChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
