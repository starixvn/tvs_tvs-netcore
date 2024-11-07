import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { Shallow } from 'shallow-render';
import { SortingModule } from '../../../../../utility/components/sorting/sorting.module';
import { ToolTipModule } from '../../../../../utility/components/tooltip/tooltip.module';
import { AddRequestApiService } from '../../add-request-api.service';
import { AddRequestStore } from '../../add-request.store';
import { FilterModel } from '../../filter/filter.model';
import { AbnormalAccountModel } from '../../models/abnormal-account.model';
import { TransInfoAddRequestModel } from '../../models/trans-info-add-request.model';
import { AccountWinlostModel } from '../models/account-winlost.model';
import { CheckUsernamesViewModel, ValidationAbnormalAccount } from '../models/check-username.model';
import { ValidationService } from '../services/validation.service';
import { AccountTableComponent } from './account-table.component';

class Helper {
  static readonly fakeDate: string = '2020-11-09 12:08:49.737';
  static readonly fakeCheckUsernamesViewModel: CheckUsernamesViewModel = {
    accountWinlostModels: [
      {
        custId: 1,
        username: '1',
        adjustVoidLimit: null,
      } as AccountWinlostModel,
      {
        custId: 2,
        username: '2',
        adjustVoidLimit: 1,
      } as AccountWinlostModel
    ],
    transInfoAddRequestModel: new TransInfoAddRequestModel(),
    validation: new ValidationAbnormalAccount()
  };
  static readonly fakeFilterModel: FilterModel = {
    issueTypeId: '11',
    subIssueTypeId: '27',
    action: '5',
    isTest: false,
    isVoided: false,
    subIssueTypes: [],
    isAbnormal: false
  } as FilterModel;
}

describe('AccountTableComponent', () => {
  @NgModule({
    imports: [
      FormsModule,
      NgbModule,
      SortingModule,
      ToolTipModule
    ],
    providers: [
      AddRequestStore,
      AddRequestApiService,
      ValidationService
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<AccountTableComponent>;

  beforeEach(() => {
    shallow = new Shallow(AccountTableComponent, AppModuleTest).dontMock(NgbModule);
  });

  it('AccountTableComponent should init match snapshot', async () => {
    const { fixture } = await shallow.render();
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('reCalculate should update isCancelRecalculateAmount to false & return when isCancelRecalculateAmount true', async () => {
    const model = new AccountWinlostModel();
    const { instance } = await shallow.render();
    instance.isCancelRecalculateAmount = true;
    await instance.reCalculate(model, 1);

    expect(model.isShowInput).toBeFalsy();
    expect(instance.isCancelRecalculateAmount).toBeFalsy();
  });

  it('reCalculate should call #isCorrectFormatVoidLimit when isCorrectFormatVoidLimit false', async () => {
    const model = new AccountWinlostModel();
    const { instance } = await shallow.render();
    instance.isCancelRecalculateAmount = false;
    instance.isCorrectFormatVoidLimit = jest.fn().mockReturnValue(false);
    await instance.reCalculate(model, 1);

    expect(instance.isCorrectFormatVoidLimit).toHaveBeenCalledTimes(1);
  });

  it('reCalculate should update account model when has newest data', async () => {
    const model = new AccountWinlostModel();
    model.custId = Helper.fakeCheckUsernamesViewModel.accountWinlostModels[0].custId;
    const mockChangeBlockingUiStatus = jest.fn();
    const { instance } = await shallow
      .mock(ValidationService, { getValidation: jest.fn().mockReturnValue(Helper.fakeCheckUsernamesViewModel) })
      .mock(AddRequestStore, { changeBlockingUiStatus: mockChangeBlockingUiStatus })
      .render();
    instance.isCancelRecalculateAmount = false;
    instance.isCorrectFormatVoidLimit = jest.fn().mockReturnValue(true);
    instance.changeTable.emit = jest.fn();
    instance['createValidationBusinessRuleArgs'] = jest.fn();

    await instance.reCalculate(model, 1);

    expect(instance.isCorrectFormatVoidLimit).toHaveBeenCalledTimes(1);
    expect(instance['createValidationBusinessRuleArgs']).toHaveBeenCalledTimes(1);
    expect(model.isHighlight).toBe(Helper.fakeCheckUsernamesViewModel.accountWinlostModels[0].isHighlight);
    expect(model.givenCredit).toBe(Helper.fakeCheckUsernamesViewModel.accountWinlostModels[0].givenCredit);
    expect(model.currentLosing).toBe(Helper.fakeCheckUsernamesViewModel.accountWinlostModels[0].currentLosing);
    expect(model.currentWinning).toBe(Helper.fakeCheckUsernamesViewModel.accountWinlostModels[0].currentWinning);
  });

  it('sorting should sort data ascending', async () => {
    const mockChangeBlockingUiStatus = jest.fn();
    const { instance } = await shallow
      .mock(AddRequestStore, { changeBlockingUiStatus: mockChangeBlockingUiStatus })
      .render();
    instance.accountWinlostModels = _.cloneDeep(Helper.fakeCheckUsernamesViewModel.accountWinlostModels);
    instance.sorting(false, 'custId', 1);

    expect(instance.accountWinlostModels[0].custId).toBeLessThan(instance.accountWinlostModels[1].custId);
  });

  it('sorting should sort data descending', async () => {
    const mockChangeBlockingUiStatus = jest.fn();
    const { instance } = await shallow
      .mock(AddRequestStore, { changeBlockingUiStatus: mockChangeBlockingUiStatus })
      .render();
    instance.accountWinlostModels = _.cloneDeep(Helper.fakeCheckUsernamesViewModel.accountWinlostModels);
    instance.sorting(true, 'custId', 1);

    expect(instance.accountWinlostModels[0].custId).toBeGreaterThan(instance.accountWinlostModels[1].custId);
  });

  it('exportExcel should called #appService.exportAccount', async () => {
    const mockExportAccount = jest.fn();
    const { instance } = await shallow
      .mock(AddRequestApiService, { exportAccount: mockExportAccount })
      .render();
    instance.accountWinlostModels = Helper.fakeCheckUsernamesViewModel.accountWinlostModels;
    await instance.exportExcel();

    expect(mockExportAccount).toHaveBeenCalledTimes(1);
  });

  it('exportExcel should not called #appService.exportAccount when accountWinlostModels is empty', async () => {
    const mockExportAccount = jest.fn();
    const { instance } = await shallow
      .mock(AddRequestApiService, { exportAccount: mockExportAccount })
      .render();
    instance.accountWinlostModels = [];
    await instance.exportExcel();

    expect(mockExportAccount).toHaveBeenCalledTimes(0);
  });

  it('exportExcel should not called #appService.exportAccount when accountWinlostModels is null', async () => {
    const mockExportAccount = jest.fn();
    const { instance } = await shallow
      .mock(AddRequestApiService, { exportAccount: mockExportAccount })
      .render();
    instance.accountWinlostModels = null;
    await instance.exportExcel();

    expect(mockExportAccount).toHaveBeenCalledTimes(0);
  });

  it('createValidationBusinessRuleArgs should return exactly model', async () => {
    const { instance } = await shallow.render({
      bind: {
        filter: Helper.fakeFilterModel,
      }
    });
    instance.abnormalAccountModel = new AbnormalAccountModel();
    const actual = instance['createValidationBusinessRuleArgs'](Helper.fakeCheckUsernamesViewModel.accountWinlostModels[0]);

    expect(actual.requestId).toBe(instance.requestId);
    expect(actual.actionId).toBe(instance.filter.action);
    expect(actual.abnormalAccountModel.accountWinlostModels).toEqual([Helper.fakeCheckUsernamesViewModel.accountWinlostModels[0]]);
  });

  it('isValid should return true', async () => {
    const { instance } = await shallow.render();
    instance.accountWinlostModels = null;
    const actual = instance.isValid();

    expect(actual).toBeTruthy();
  });

  it('isValid should return false', async () => {
    const { instance } = await shallow.render();
    instance.accountWinlostModels = Helper.fakeCheckUsernamesViewModel.accountWinlostModels;
    const actual = instance.isValid();

    expect(actual).toBeTruthy();
  });

  it('onChangeAdjustGV should called #isCorrectFormatVoidLimit', async () => {
    const { instance } = await shallow.render();
    instance.isCorrectFormatVoidLimit = jest.fn();
    instance.onChangeAdjustGV(null, null);

    expect(instance.isCorrectFormatVoidLimit).toHaveBeenCalledTimes(1);
  });

  it('isCorrectFormatVoidLimit should return false when adjustVoidLimit is not valid number', async () => {
    const { instance } = await shallow.render();
    const model = _.cloneDeep(Helper.fakeCheckUsernamesViewModel.accountWinlostModels[0]);
    Object.defineProperty(model, 'adjustVoidLimit', { value: 'a'});
    const actual = instance.isCorrectFormatVoidLimit(model, null);

    expect(actual).toBeFalsy();
  });

  it('mouseDownEventAdjustGV should update isShowInput to true', async () => {
    const model = _.cloneDeep(Helper.fakeCheckUsernamesViewModel.accountWinlostModels[0]);
    model.isShowInput = false;
    const { instance } = await shallow.render({
      bind: {
        filter: Helper.fakeFilterModel,
      }
    });
    instance.filter.isVoided = false;
    instance.mouseDownEventAdjustGV(model);

    expect(model.isShowInput).toBeTruthy();
  });

  it('mouseDownEventAdjustGV should not update isShowInput to true', async () => {
    const model = _.cloneDeep(Helper.fakeCheckUsernamesViewModel.accountWinlostModels[0]);
    model.isShowInput = false;
    const { instance } = await shallow.render({
      bind: {
        filter: Helper.fakeFilterModel,
      }
    });
    instance.filter.isVoided = true;
    instance.mouseDownEventAdjustGV(model);

    expect(model.isShowInput).toBeFalsy();
  });

  it('showDecimalWithComma should return undefined when has not number input', async () => {
    const { instance } = await shallow.render();
    const actual = instance.showDecimalWithComma(null);

    expect(actual).toBeUndefined();
  });
});
