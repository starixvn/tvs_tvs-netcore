import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../../../utility/modules/testing.module';
import { SubIssueTypeDialogComponent } from './sub-issue-type-dialog.component';
import { AddRequestApiService } from '../../add-request-api.service';
import { StaticService } from '../../../../../utility/services/static.service';
import { SubIssueTypeDialogModel } from './sub-issue-type-dialog.model';
import { SimpleChange } from '@angular/core';
import { SubIssueTypeGroup } from '../../../../../utility/constants/config';
import { Button, GroupButton } from './sub-issue-type-json.model';

class Helper {
  static readonly fakeUserId = '123';
  static readonly fakeIssueTypeId = '1';
  static readonly fakeSubIssueTypeId = 1;
  static readonly fakeGroupId = 1;
  static readonly fakeNote = 'Test note';
  
  static readonly fakeDialogModel = new SubIssueTypeDialogModel();
  static readonly fakeDialogModelWithData = {
    ...new SubIssueTypeDialogModel(),
    isOpen: true,
    issueTypeId: Helper.fakeIssueTypeId,
    allowanceTime: {
      aaTime: 0,
      paTime: 0,
      saTime: 0
    }
  };

  static readonly fakeGroupButton: GroupButton = {
    groupId: Helper.fakeGroupId,
    name: 'Test Group',
    iconClass: 'test-icon',
    aa: '1',
    pa: '2',
    sa: '3',
    buttonSelectAll: [],
    buttonSelectHomeAway: [],
    description: [],
    note: '',
    noteEditable: false
  };

  static readonly fakeButton: Button = {
    subIssueTypeId: Helper.fakeSubIssueTypeId,
    name: 'Test Button',
    btnClass: 'test-icon'
  };
}

describe('SubIssueTypeDialogComponent', () => {
  let component: SubIssueTypeDialogComponent;
  let fixture: ComponentFixture<SubIssueTypeDialogComponent>;
  let apiService: AddRequestApiService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        AddRequestApiService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SubIssueTypeDialogComponent);
    apiService = fixture.debugElement.injector.get(AddRequestApiService);
    component = fixture.componentInstance;
    
    // Mock document.getElementById
    document.body.innerHTML = '<div id="body" user-id="123"></div>';
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    // Arrange
    component.model = Helper.fakeDialogModel;
    
    // Act
    component.ngOnInit();
    
    // Assert
    expect(component.userId).toBe(Helper.fakeUserId);
    expect(component.isCheckedWrongScoreOnwards).toBeFalsy();
  });

  it('should handle model changes when dialog opens', async () => {
    // Arrange
    component.model = Helper.fakeDialogModelWithData;
    component['getSubIssueTypeWithUserNote'] = jest.fn();
    
    // Act
    component.ngOnChanges({
      model: {
        currentValue: Helper.fakeDialogModelWithData,
        previousValue: null,
        firstChange: true
      } as SimpleChange
    });
    
    // Assert
    expect(component.isCheckedWrongScoreOnwards).toBeFalsy();
    expect(component['getSubIssueTypeWithUserNote']).toHaveBeenCalled();
  });

  it('should close popup and prevent note editable', () => {
    // Arrange
    component.model = Helper.fakeDialogModelWithData;
    component['preventNoteEditable'] = jest.fn();
    
    // Act
    component.closePopup();
    
    // Assert
    expect(component.model.isOpen).toBeFalsy();
    expect(component['preventNoteEditable']).toHaveBeenCalled();
  });

  it('should handle sub issue type selection', () => {
    // Arrange
    const group = Helper.fakeGroupButton;
    const subIssueTypeId = Helper.fakeSubIssueTypeId;
    component.updateSubTypeEvent.emit = jest.fn();
    
    // Act
    component.onSelectSubIssueType(group, subIssueTypeId);
    
    // Assert
    expect(component.model.allowanceTime).toEqual({
      aaTime: 1,
      paTime: 2,
      saTime: 3
    });
    expect(component.updateSubTypeEvent.emit).toHaveBeenCalledWith(subIssueTypeId);
  });

  it('should check if buttons exist', () => {
    // Arrange
    const buttons = [Helper.fakeButton];
    
    // Act & Assert
    expect(component.isHaveButton(buttons)).toBeTruthy();
    expect(component.isHaveButton([])).toBeFalsy();
    expect(component.isHaveButton(null)).toBeFalsy();
  });

  it('should handle wrong score type change', async () => {
    // Arrange
    component['getSubIssueTypeWithUserNote'] = jest.fn();
    
    // Act
    component.onChangeTypeOfWrongScore();
    
    // Assert
    expect(component.subIssueTypes).toBeDefined();
  });

  it('should check if button select all can be shown', () => {
    // Arrange
    const buttons = [{
      ...Helper.fakeButton,
      subIssueTypeId: SubIssueTypeGroup.SUBTYPE_HAVE_HIDE_OPTION[0]
    }];
    component.isCheckedViewAllOptions = true;
    
    // Act & Assert
    expect(component.checkCanShowButtonSelectAll(buttons)).toBeTruthy();
    
    component.isCheckedViewAllOptions = false;
    expect(component.checkCanShowButtonSelectAll(buttons)).toBeFalsy();
  });

  it('should get correct sub type config based on issue type', () => {
    // Arrange
    component.model.issueTypeId = Helper.fakeIssueTypeId;
    StaticService.isDangerAccepted = jest.fn().mockReturnValue(true);
    
    // Act
    const result = component['getSubTypeConfig']();
    
    // Assert
    expect(result).toBeDefined();
  });

  it('should handle note editing', () => {
    // Arrange
    const groupButton = Helper.fakeGroupButton;
    
    // Act
    component.editNote(groupButton);
    
    // Assert
    expect(groupButton.noteEditable).toBeTruthy();
  });

  it('should save note', async () => {
    // Arrange
    const groupButton = {
      ...Helper.fakeGroupButton,
      note: Helper.fakeNote,
      noteEditable: true
    };
    apiService.saveSubIssueTypeNote = jest.fn().mockResolvedValue(undefined);
    
    // Act
    await component.saveNote(groupButton);
    
    // Assert
    expect(groupButton.noteEditable).toBeFalsy();
    expect(apiService.saveSubIssueTypeNote).toHaveBeenCalledWith({
      issueTypeId: Number(component.model.issueTypeId),
      groupId: groupButton.groupId,
      userId: Number(component.userId),
      note: groupButton.note
    });
  });

  it('should get sub issue type with user note', async () => {
    // Arrange
    component.model.issueTypeId = Helper.fakeIssueTypeId;
    const mockNotes = [{
      groupId: Helper.fakeGroupId,
      note: Helper.fakeNote
    }];
    apiService.getSubIssueTypeNote = jest.fn().mockResolvedValue(mockNotes);
    
    // Act
    await component['getSubIssueTypeWithUserNote']();
    
    // Assert
    expect(component.isBlockUi).toBeFalsy();
    expect(component.subIssueTypes).toBeDefined();
  });
});
