import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupBetTypesComponent } from './group-bet-types.component';

describe('GroupBetTypesComponent', () => {
  let component: GroupBetTypesComponent;
  let fixture: ComponentFixture<GroupBetTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupBetTypesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupBetTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
