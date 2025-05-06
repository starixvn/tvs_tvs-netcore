import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../../utility/modules/testing.module';
import { ConfirmAddRequestComponent } from './confirm-add-request.component';
import { ConfirmAddRequestModel } from './confirm-add-request.model';
import { IssueTypes } from '../filter/issue-types.model';
import { Selection } from '../../../../utility/models/selection.model';
import { SimpleChange } from '@angular/core';

class Helper {
  static readonly fakeIssueTypes: IssueTypes = {
    issueId: 1,
    subIssueId: 1,
    selectedSubIssueTypes: [],
    issueTypes: [
      { issueTypeId: 1, issueTypeName: 'Test Issue Type' }
    ],
    subIssueTypes: [
      { 
        issueTypeId: 1,
        subIssueTypeId: 1, 
        subIssueTypeName: 'Test Sub Issue Type',
        subIssueTypeNameCS: 'Test Sub Issue Type CS'
      }
    ]
  };

  static readonly fakeVoidActions: Selection[] = [
    { value: '1', name: 'Test Action 1' },
    { value: '2', name: 'Test Action 2' }
  ];
}

describe('ConfirmAddRequestComponent', () => {
  let component: ConfirmAddRequestComponent;
  let fixture: ComponentFixture<ConfirmAddRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmAddRequestComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.model).toBeInstanceOf(ConfirmAddRequestModel);
    expect(component.issueTypes).toBeUndefined();
    expect(component.voidActions).toEqual([]);
    expect(component.selectedVoidAction).toBeUndefined();
    expect(component.selectedSubIssueType).toBeUndefined();
  });

  it('should handle issue type changes correctly', () => {
    // Arrange
    component.issueTypes = Helper.fakeIssueTypes;
    component.selectedSubIssueType = 1;

    // Act
    component.ngOnChanges({
      issueTypes: new SimpleChange(null, Helper.fakeIssueTypes, true),
      selectedSubIssueType: new SimpleChange(null, 1, true)
    });

    // Assert
    expect(component.issueTypeName).toBe('Test Issue Type');
    expect(component.subIssueTypeName).toBe('Test Sub Issue Type');
  });

  it('should handle void action changes correctly', () => {
    // Arrange
    component.voidActions = Helper.fakeVoidActions;
    component.selectedVoidAction = '1';

    // Act
    component.ngOnChanges({
      voidActions: new SimpleChange(null, Helper.fakeVoidActions, true),
      selectedVoidAction: new SimpleChange(null, '1', true)
    });

    // Assert
    expect(component.actionName).toBe('Test Action 1');
  });

  it('should emit cancel event when clicking cancel button', () => {
    // Arrange
    const spy = jest.spyOn(component.clickCancel, 'emit');
    component.model.isOpen = true;

    // Act
    component.onClickCancel();

    // Assert
    expect(component.model.isOpen).toBeFalsy();
    expect(spy).toHaveBeenCalled();
  });

  it('should emit ok event when clicking ok button', () => {
    // Arrange
    const spy = jest.spyOn(component.clickOk, 'emit');
    component.model.isOpen = true;

    // Act
    component.onClickOk();

    // Assert
    expect(component.model.isOpen).toBeFalsy();
    expect(spy).toHaveBeenCalled();
  });

  it('should not update action name when void actions are not provided', () => {
    // Arrange
    component.voidActions = undefined;
    component.selectedVoidAction = '1';

    // Act
    component.ngOnChanges({
      selectedVoidAction: new SimpleChange(null, '1', true)
    });

    // Assert
    expect(component.actionName).toBeUndefined();
  });

  it('should throw error when issue types are not provided', () => {
    // Arrange
    component.issueTypes = undefined;
    component.selectedSubIssueType = 1;

    // Act & Assert
    expect(() => {
      component.ngOnChanges({
        selectedSubIssueType: new SimpleChange(null, 1, true)
      });
    }).toThrow();
  });
});
