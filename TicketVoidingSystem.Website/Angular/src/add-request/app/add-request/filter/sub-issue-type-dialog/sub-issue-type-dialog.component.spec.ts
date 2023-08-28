import { NgModule, SimpleChange } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Shallow } from 'shallow-render';
import { IssueTypeConstant } from '../../../../../utility/constants/issue-type.constant';
import { SubIssueTypeConstant } from '../../../../../utility/constants/sub-issue-type.constant';
import { AddRequestApiService } from '../../add-request-api.service';
import { SubIssueTypeNoteModel } from '../../models/sub-type-note.model';
import { SubIssueTypeDialogComponent } from './sub-issue-type-dialog.component';
import { SubIssueTypeDialogModel } from './sub-issue-type-dialog.model';
import { Button, Category, GroupButton } from './sub-issue-type-json.model';

describe('SubIssueTypeDialogComponent', () => {
  @NgModule({
    declarations: [],
    imports: [
      FormsModule,
      NgbModule,
    ],
    providers: [
      AddRequestApiService
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<SubIssueTypeDialogComponent>;

  beforeEach(() => {
    shallow = new Shallow(SubIssueTypeDialogComponent, AppModuleTest);
    const element = document.createElement('section');
    element.setAttribute("user-id", "1");
    document.getElementById = jest.fn().mockImplementation(() => element);
  });

  it('SubIssueTypeDialogComponent should init match snapshot', async () => {
    const { instance, fixture } = await shallow.render();
    instance.model = new SubIssueTypeDialogModel();
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('#ngOnChanges should call #getSubIssueTypeWithUserNote', async () => {
    const model = new SubIssueTypeDialogModel();
    model.issueTypeId = IssueTypeConstant.DANGER_ACCEPTED;
    const { instance } = await shallow.render();
    const changes = {
      'model': new SimpleChange(null, model, true)
    };
    instance.model.isOpen = true;
    instance['getSubIssueTypeWithUserNote'] = jest.fn();
    instance.ngOnChanges(changes);

    expect(instance['getSubIssueTypeWithUserNote']).toHaveBeenCalledTimes(1);
  });

  it('#ngOnChanges should not call #getSubIssueTypeWithUserNote', async () => {
    const model = new SubIssueTypeDialogModel();
    model.issueTypeId = IssueTypeConstant.DANGER_ACCEPTED;
    const { instance } = await shallow.render();
    const changes = {
      'aa': new SimpleChange(null, model, true)
    };
    instance['getSubIssueTypeWithUserNote'] = jest.fn();
    instance.ngOnChanges(changes);

    expect(instance['getSubIssueTypeWithUserNote']).toHaveBeenCalledTimes(0);
  });

  it('#ngOnChanges should not call #isDangerAccepted', async () => {
    const { instance } = await shallow.render();
    instance.isDangerAccepted = jest.fn();
    instance.ngOnChanges({});

    expect(instance.isDangerAccepted).toHaveBeenCalledTimes(0);
  });

  it('#onClose should update correct data', async () => {
    const { instance } = await shallow.render();
    instance.model = new SubIssueTypeDialogModel();
    instance.closePopup();

    expect(instance.model.isOpen).toBe(false);
  });

  it('#onSelectSubIssueType should emit updateSubTypeEvent', async () => {
    const groupButton = new GroupButton();
    const { instance } = await shallow.render();
    instance.model = new SubIssueTypeDialogModel();
    instance.updateSubTypeEvent.emit = jest.fn();
    instance.onSelectSubIssueType(groupButton, 1);

    expect(instance.updateSubTypeEvent.emit).toHaveBeenCalledTimes(1);
  });

  it('#isHaveButton should return true', async () => {
    const button = new Button();
    const { instance } = await shallow.render();
    const actual = instance.isHaveButton([button]);

    expect(actual).toBeTruthy();
  });

  it('#isHaveButton should return false', async () => {
    const { instance } = await shallow.render();
    const actual = instance.isHaveButton([]);

    expect(actual).toBe(false);
  });

  it('#isDangerAccepted should return false', async () => {
    const { instance } = await shallow.render();
    instance.model = new SubIssueTypeDialogModel();
    instance.model.issueTypeId = IssueTypeConstant.RED_CARD;
    const actual = instance.isDangerAccepted();

    expect(actual).toBe(false);
  });

  it('#isDangerAccepted should return true', async () => {
    const { instance } = await shallow.render();
    instance.model = new SubIssueTypeDialogModel();
    instance.model.issueTypeId = IssueTypeConstant.DANGER_ACCEPTED;
    const actual = instance.isDangerAccepted();

    expect(actual).toBe(true);
  });

  it('#checkCanShowButtonSelectAll should return false', async () => {
    const button = new Button();
    button.subIssueTypeId = SubIssueTypeConstant.GOAL;
    const { instance } = await shallow.render();
    instance.model = new SubIssueTypeDialogModel();
    instance.isCheckedViewAllOptions = false;
    const actual = instance.checkCanShowButtonSelectAll([button]);

    expect(actual).toBe(false);
  });

  it('#checkCanShowButtonSelectAll should return true', async () => {
    const button = new Button();
    button.subIssueTypeId = 3;
    const { instance } = await shallow.render();
    instance.model = new SubIssueTypeDialogModel();
    instance.isCheckedViewAllOptions = false;
    const actual = instance.checkCanShowButtonSelectAll([button]);

    expect(actual).toBe(true);
  });

  it('#checkCanShowButtonSelectAll should return false when have not any buttons', async () => {
    const { instance } = await shallow.render();
    instance.model = new SubIssueTypeDialogModel();
    instance.isCheckedViewAllOptions = false;
    const actual = instance.checkCanShowButtonSelectAll([]);

    expect(actual).toBe(false);
  });

  it('#onChangeTypeOfWrongScore should called #getSubIssueTypeWrongScoreConfig', async () => {
    const { instance } = await shallow.render();
    instance['getSubIssueTypeWrongScoreConfig'] = jest.fn();

    instance.onChangeTypeOfWrongScore();

    expect(instance['getSubIssueTypeWrongScoreConfig']).toHaveBeenCalledTimes(1);
  });

  it('#getSubTypeConfig should return empty', async () => {
    const { instance } = await shallow.render();
    instance.model = new SubIssueTypeDialogModel();
    instance.model.issueTypeId = null;

    const actual = instance['getSubTypeConfig']();

    expect(actual.length).toBe(0);
  });

  it('#isDangerAccepted should return true', async () => {
    const { instance } = await shallow.render();
    instance.model = new SubIssueTypeDialogModel();
    instance.model.issueTypeId = IssueTypeConstant.DANGER_ACCEPTED;

    const actual = instance.isDangerAccepted();

    expect(actual).toBeTruthy();
  });

  it('#isWrongScore should return true', async () => {
    const { instance } = await shallow.render();
    instance.model = new SubIssueTypeDialogModel();
    instance.model.issueTypeId = IssueTypeConstant.WRONG_SCORE;

    const actual = instance.isWrongScore();

    expect(actual).toBeTruthy();
  });

  it('#isHasSubTypeNoOnWards should return false when button null', async () => {
    const { instance } = await shallow.render();
    const groupButton = new GroupButton();
    groupButton.buttonSelectAll = null;
    groupButton.buttonSelectHomeAway = null;

    const actual = instance['isHasSubTypeNoOnWards'](groupButton);

    expect(actual).toBeFalsy();
  });

  it('#isHasSubTypeNoOnWards should return false', async () => {
    const { instance } = await shallow.render();
    const groupButton = new GroupButton();
    const button = new Button();
    button.subIssueTypeId = 1231;
    groupButton.buttonSelectAll = [button];
    groupButton.buttonSelectHomeAway = null;

    const actual = instance['isHasSubTypeNoOnWards'](groupButton);

    expect(actual).toBeFalsy();
  });

  it('#isHasSubTypeNoOnWards should return false', async () => {
    const { instance } = await shallow.render();
    const groupButton = new GroupButton();
    const button = new Button();
    button.subIssueTypeId = 1231;
    groupButton.buttonSelectAll = [];
    groupButton.buttonSelectHomeAway = [button];

    const actual = instance['isHasSubTypeNoOnWards'](groupButton);

    expect(actual).toBeFalsy();
  });

  it('#isHasSubTypeNoOnWards should return true', async () => {
    const { instance } = await shallow.render();
    const groupButton = new GroupButton();
    const button = new Button();
    button.subIssueTypeId = SubIssueTypeConstant.NO_INDICATION_AWAY_GOAL_NO_ONWARDS;
    groupButton.buttonSelectAll = [];
    groupButton.buttonSelectHomeAway = [button];

    const actual = instance['isHasSubTypeNoOnWards'](groupButton);

    expect(actual).toBeTruthy();
  });

  it('#isHasSubTypeOnWards should return false when button null', async () => {
    const { instance } = await shallow.render();
    const groupButton = new GroupButton();
    groupButton.buttonSelectAll = null;
    groupButton.buttonSelectHomeAway = null;

    const actual = instance['isHasSubTypeOnWards'](groupButton);

    expect(actual).toBeFalsy();
  });

  it('#isHasSubTypeOnWards should return false', async () => {
    const { instance } = await shallow.render();
    const groupButton = new GroupButton();
    const button = new Button();
    button.subIssueTypeId = 1231;
    groupButton.buttonSelectAll = [button];
    groupButton.buttonSelectHomeAway = null;

    const actual = instance['isHasSubTypeOnWards'](groupButton);

    expect(actual).toBeFalsy();
  });

  it('#isHasSubTypeOnWards should return false', async () => {
    const { instance } = await shallow.render();
    const groupButton = new GroupButton();
    const button = new Button();
    button.subIssueTypeId = 1231;
    groupButton.buttonSelectAll = [];
    groupButton.buttonSelectHomeAway = [button];

    const actual = instance['isHasSubTypeOnWards'](groupButton);

    expect(actual).toBeFalsy();
  });

  it('#isHasSubTypeOnWards should return true', async () => {
    const { instance } = await shallow.render();
    const groupButton = new GroupButton();
    const button = new Button();
    button.subIssueTypeId = SubIssueTypeConstant.WRONG_INDICATION_SCORE_ONWARDS;
    groupButton.buttonSelectAll = [];
    groupButton.buttonSelectHomeAway = [button];

    const actual = instance['isHasSubTypeOnWards'](groupButton);

    expect(actual).toBeTruthy();
  });

  it('#preventNoteEditable should update all subIssueTypes to noteEditable true', async () => {
    const { instance } = await shallow.render();
    const category = new Category();
    category.groups=[new GroupButton()];
    instance.subIssueTypes = [category];
    instance['preventNoteEditable']();

    expect(instance.subIssueTypes.flatMap(x => x.groups).every(y => y.noteEditable)).toBeFalsy();
  });

  it('#editNote should update noteEditable true', async () => {
    const groupButton = new GroupButton();
    const { instance } = await shallow.render();
    jest.useFakeTimers();
    instance.editNote(groupButton);
    jest.runAllTimers();

    expect(groupButton.noteEditable).toBeTruthy();
  });

  it('#saveNote should call #saveSubIssueTypeNote', async () => {
    const element = document.createElement('section');
    element.setAttribute("noteGroup", "1");
    element.innerHTML = 'innerHTML';
    document.getElementById = jest.fn().mockImplementation(() => element);
    const groupButton = new GroupButton();
    groupButton.note = '';
    const mockSaveSubIssueTypeNote = jest.fn();
    const { instance } = await shallow
    .mock(AddRequestApiService, { saveSubIssueTypeNote: mockSaveSubIssueTypeNote })
    .render();
    instance.model = new SubIssueTypeDialogModel();
    instance.model.issueTypeId = IssueTypeConstant.DANGER_ACCEPTED;
    instance.userId = '11';
    await instance.saveNote(groupButton);

    expect(mockSaveSubIssueTypeNote).toHaveBeenCalledTimes(1);
  });

  it('#getSubIssueTypeWithUserNote should call #getSubIssueTypeNote', async () => {
    const subNote = new SubIssueTypeNoteModel();
    subNote.groupId = 1;
    subNote.note = 'note';
    const button = new GroupButton();
    button.groupId = 1;
    const category = new Category();
    category.groups=[button];
    const mockGetSubIssueTypeNote = jest.fn().mockReturnValue([subNote]);
    const { instance } = await shallow
    .mock(AddRequestApiService, { getSubIssueTypeNote: mockGetSubIssueTypeNote })
    .render();
    instance['getSubTypeConfig'] = jest.fn().mockReturnValue([category]);
    instance.model = new SubIssueTypeDialogModel();
    instance.model.issueTypeId = IssueTypeConstant.DANGER_ACCEPTED;
    instance.userId = '11';
    await instance['getSubIssueTypeWithUserNote']();

    expect(mockGetSubIssueTypeNote).toHaveBeenCalledTimes(1);
  });
});
