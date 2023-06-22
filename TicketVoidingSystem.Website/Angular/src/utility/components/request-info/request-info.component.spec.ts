import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SimpleChange } from '@angular/core';
import { IssueInfo } from '../../models/issue-type.model';
import { DateTimeModule } from '../date-time/date-time.module';
import { RequestInfoComponent } from './request-info.component';

describe('RequestInfoComponent', () => {
  let component: RequestInfoComponent;
  let fixture: ComponentFixture<RequestInfoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestInfoComponent ],
      imports: [
        DateTimeModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestInfoComponent);
    component = fixture.componentInstance;
  });

  it('ngOnInit', () => {
    // Arrange
    // Action and Assert
    component.ngOnInit();
  });

  it('ngOnChanges', () => {
    // Arrange
    const issueInfo:  IssueInfo = {
      name: 'Abnormal',
      subIssueTypeId: 27,
      issueTypeId: 11,
      subIssueTypeName: 'Abnormal',
      subIssueTypeNameCS: '非正常'
    };
    const changes = {
      'issue': new SimpleChange(new IssueInfo(), issueInfo, true),
    };
    component['updateIssue'] = jest.fn();

    // Action and Assert
    component.ngOnChanges(changes);
    expect(component['updateIssue']).toHaveBeenCalled();
  });

  it('Update issue with issue type is abnormal bet', () => {
    // Arrange
    const issueInfo:  IssueInfo = {
      name: 'Abnormal',
      subIssueTypeId: 27,
      issueTypeId: 11,
      subIssueTypeName: 'Abnormal',
      subIssueTypeNameCS: '非正常'
    };
    component.issue = issueInfo;
    // Action and Assert
    component['updateIssue']();
    expect(component.issueTypeName).toBe(component.issue.name);
    expect(component.isEarlyKOIssueType).toBe(false);
  });

  it('Update issue with issue type is early kick off', () => {
    // Arrange
    const issueInfo:  IssueInfo = {
      name: 'Early Kick Off',
      subIssueTypeId: 8,
      issueTypeId: 8,
      subIssueTypeName: 'None Live',
      subIssueTypeNameCS: '非正常'
    };
    component.issue = issueInfo;
    // Action and Assert
    component['updateIssue']();
    expect(component.issueTypeName).toBe(`${component.issue.name} - ${component.issue.subIssueTypeName}`);
    expect(component.isEarlyKOIssueType).toBe(true);
  });
});
