import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { VoidOtherIssueComponent } from './void-other-issue.component';

describe('VoidOtherIssueComponent', () => {
  let component: VoidOtherIssueComponent;
  let fixture: ComponentFixture<VoidOtherIssueComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VoidOtherIssueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoidOtherIssueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
