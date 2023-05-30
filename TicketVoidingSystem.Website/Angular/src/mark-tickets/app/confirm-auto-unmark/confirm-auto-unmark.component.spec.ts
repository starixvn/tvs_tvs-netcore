import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { Shallow } from 'shallow-render';
import { AutoRefreshComponent } from '../../../utility/components/auto-refresh/auto-refresh.component';
import { AutoRefreshMode } from '../../../utility/components/auto-refresh/auto-refresh.model';
import { BlockUiModule } from '../../../utility/components/block-ui/block-ui.module';
import { ModalType } from '../../../utility/components/modal/modal.model';
import { ModalService } from '../../../utility/components/modal/modal.service';
import { PagingModule } from '../../../utility/components/paging/paging.module';
import { Tooltip } from '../../../utility/components/tooltip/tooltip.model';
import { ToolTipModule } from '../../../utility/components/tooltip/tooltip.module';
import { MarkType } from '../../../utility/constants/config';
import { NumbersOnlyDirective } from '../../../utility/directives/numbers-only.directive';
import { SportInfo } from '../../../utility/models/event.model';
import { Result } from '../../../utility/models/result';
import { Selection } from '../../../utility/models/selection.model';
import { CommonService } from '../../../utility/services/common.service';
import { AppService } from '../app.service';
import { CheckValidateService } from '../services/check-validate.service';
import { ConfirmAutoUnmarkComponent } from './confirm-auto-unmark.component';
import { ConfirmAutoUnmarkQuery, ConfirmAutoUnmarkViewModel, GetDataForConfirmAutoUnmarkViewModel, UpdateConfirmAutoUnmark } from './confirm-auto-unmark.model';

class Helper {
  static readonly matchIdSelector = 'input.match-id';
  static readonly excludeTestSelector = 'input.checkbox-exclude-test';
  static readonly searchButtonSelector = 'button.btn-search';
  static readonly confirmButtonSelector = 'button.btn-confirm';

  static fakeConfirmAutoUnmarkViewModel: GetDataForConfirmAutoUnmarkViewModel = {
    totalItems: 29,
      items: [
        {
          no: 1, matchId: '1999', kickOffTime: new Date('2020-04-30'), sportName: 'sportname', event: 'eventname', htScore: '1-1', betId: 7,
          ftScore: 'x', userId: 232, markedBy: 'sa', bettype: 11, bettypeName: 'hdp', totalItems: 11, isConfirm: true, markType: 1
        },
        {
          no: 2, matchId: '22229', kickOffTime: new Date('2020-03-10'), sportName: 'sportname2', event: 'eventname2', htScore: '2-2', ftScore: '2',
          userId: 222, markedBy: 'sa22', bettype: 22, bettypeName: 'OU', betId: 7, totalItems: 22, isConfirm: true, markType: 1
        },
      ]
  };
}

@NgModule({
  declarations: [ConfirmAutoUnmarkComponent, NumbersOnlyDirective, AutoRefreshComponent],
  imports: [
    BlockUiModule,
    FormsModule,
    NgSelectModule,
    PagingModule,
    ToolTipModule
  ],
  providers: [
    CommonService,
    ModalService,
    AppService,
    CheckValidateService
  ]
})
class ModuleTest { }

describe('ConfirmAutoUnmarkComponent', () => {
  let shallow: Shallow<ConfirmAutoUnmarkComponent>;
  const sportInfos: SportInfo[] = [{
      sportName: 'sport1',
      sportType: 1
    },
    {
      sportName: 'sport2',
      sportType: 2
    }
  ];
  const sportSelection: Array<Selection> = [{
      group: 'All',
      name: 'sport1',
      value: '1',
    },
    {
      group: 'All',
      name: 'sport2',
      value: '2',
    }
  ];

  beforeEach(() => {
    const mockGetSportsTypeFunc = jest.fn().mockImplementation(() => (sportInfos));
    const element = document.createElement('body');
    element.setAttribute('id', 'body');
    element.setAttribute('user-id', '8');
    document.body.appendChild(element);

    shallow = new Shallow(ConfirmAutoUnmarkComponent, ModuleTest)
      .mock(CommonService, {
        getSportsType: mockGetSportsTypeFunc,
      })
      .mock(ModalService, {});
  });

  it('ConfirmAutoUnmarkComponent init should match snapshot with expected data', async () => {
    const mockGetDataForConfirmAutoUnmarkFunc = jest.fn().mockImplementation(() => Promise.resolve(Helper.fakeConfirmAutoUnmarkViewModel));
    const mockGetSportsTypeFunc = jest.fn().mockImplementation(() => (sportInfos));
    const { fixture, instance } = await shallow
      .mock(AppService, {
        getDataForConfirmAutoUnmark: mockGetDataForConfirmAutoUnmarkFunc,
      })
      .mock(CommonService, {
        getSportsType: mockGetSportsTypeFunc
      })
      .render();
    instance.tooltip = new Tooltip();
    instance.tooltip.display = jest.fn();
    instance.models = Helper.fakeConfirmAutoUnmarkViewModel.items;
    expect(fixture).toMatchSnapshot();
    expect(instance.isBlock).toBe(false);
    expect(instance.sportOptions).toStrictEqual(sportSelection);
    expect(instance.selectedSports).toStrictEqual(sportSelection.map(x => x.value));
    expect(instance.markedByOptions).toStrictEqual([{ name: '<<<< Me >>>>', value: '8' }, { name: 'All', value: '0' }]);
    expect(instance.query.matchId).toBeNull();
    expect(instance.query.isExcludeTest).toBe(true);
    expect(instance.query.pageIndex).toBe(instance.paging.page - 1);
    expect(instance.models).toStrictEqual(Helper.fakeConfirmAutoUnmarkViewModel.items);
  });

  it('ConfirmAutoUnmarkComponent init should match snapshot with no data', async () => {
    const { fixture } = await shallow
      .render();

    expect(fixture).toMatchSnapshot();
  });

  it('Click search button should call #resetPagingAndSearchData', async () => {
    const { instance, find, } = await shallow
    .mock(CheckValidateService, { checkValidMatch : jest.fn().mockImplementation(() => Promise.resolve(false)) })
    .render();
    const spyResetPagingAndSearchData = jest.spyOn(instance, 'resetPagingAndSearchData');
    const mockSearchData = jest.fn();
    instance.searchData = mockSearchData;
    instance.tooltip = new Tooltip();
    instance.tooltip.display = jest.fn();
    const searchButton = find(Helper.searchButtonSelector);
    searchButton.triggerEventHandler('click', {});

    expect(spyResetPagingAndSearchData).toBeCalledTimes(1);
    expect(spyResetPagingAndSearchData).toBeCalledWith();
  });

  it('AutoRefreshComponent should call #onCountdownRefreshEnd when emit (countdownEnd) event', async () => {
    const mockCloseFunc = jest.fn();
    const { instance, findComponent } = await shallow
      .mock(ModalService, { close: mockCloseFunc })
      .render();
    const spyOnCountdownRefreshEnd = jest.spyOn(instance, 'onCountdownRefreshEnd');
    instance.tooltip = new Tooltip();
    instance.tooltip.display = jest.fn();
    const mockResetPagingAndSearchData = jest.fn();
    instance.resetPagingAndSearchData = mockResetPagingAndSearchData;

    const autoRefresh = findComponent(AutoRefreshComponent);
    autoRefresh.countdownEnd.emit();

    expect(autoRefresh).toHaveFound(1);
    expect(spyOnCountdownRefreshEnd).toBeCalledTimes(1);
    expect(spyOnCountdownRefreshEnd).toBeCalledWith();
    expect(mockCloseFunc).toBeCalledTimes(1);
    expect(mockCloseFunc).toHaveBeenCalledWith();
    expect(mockResetPagingAndSearchData).toBeCalledTimes(1);
    expect(mockResetPagingAndSearchData).toHaveBeenCalledWith();
  });

  it('#onClickConfirm should show confirm modal when', async () => {
    const mockGetDataForConfirmAutoUnmarkFunc = jest.fn().mockImplementation(() => Promise.resolve(Helper.fakeConfirmAutoUnmarkViewModel));
    const mockConfirmFunc = jest.fn();
    const { instance } = await shallow
      .mock(AppService, { getDataForConfirmAutoUnmark: mockGetDataForConfirmAutoUnmarkFunc })
      .mock(ModalService, { confirm: mockConfirmFunc })
      .render();

    instance.onClickConfirm(new ConfirmAutoUnmarkViewModel());
    expect(mockConfirmFunc).toBeCalledTimes(1);
    expect(mockConfirmFunc.mock.calls[0][0]).toMatchSnapshot();
    expect(mockConfirmFunc.mock.calls[0][1]).toBeInstanceOf(Function);
  });

  it('Should show modal Confirm Auto Unmark successfully when click confirm YES', async () => {
    // Arrange
    const mockGetDataForConfirmAutoUnmarkFunc = jest.fn().mockImplementation(() => Promise.resolve(Helper.fakeConfirmAutoUnmarkViewModel));
    const mockUpdateConfirmAutoUnmark = jest.fn().mockImplementation(() => ({ errorCode: 0, isSuccessful: true } as Result<null>));
    const mockConfirmFunc = jest.fn();
    const mockOpenFunc = jest.fn();
    const { instance } = await shallow
      .mock(AppService, {
        getDataForConfirmAutoUnmark: mockGetDataForConfirmAutoUnmarkFunc,
        updateConfirmAutoUnmark: mockUpdateConfirmAutoUnmark
      })
      .mock(ModalService, {
        confirm: mockConfirmFunc,
        open: mockOpenFunc
      })
      .render();
    const mockResetPagingAndSearchData = jest.fn();
    instance.resetPagingAndSearchData = mockResetPagingAndSearchData;
    instance.onClickConfirm(Helper.fakeConfirmAutoUnmarkViewModel.items[0]);

    // Act
    await mockConfirmFunc.mock.calls[0][1]();

    // Assert
    expect(mockConfirmFunc).toBeCalledTimes(1);
    expect(instance.autoRefreshMode).toBe(AutoRefreshMode.STOP);
    expect(mockUpdateConfirmAutoUnmark).toBeCalledTimes(1);
    expect(mockUpdateConfirmAutoUnmark).toBeCalledWith({
      betId: 7,
      betType: 11,
      markedBy: 232,
      matchId: '1999'
    } as UpdateConfirmAutoUnmark);
    expect(mockOpenFunc).toBeCalledTimes(1);
    expect(mockOpenFunc.mock.calls[0][0]).toStrictEqual(
      {
        message: 'Confirm Auto Unmark successfully!',
        title: 'Auto Unmark',
        type: ModalType.Alert
      }
    );
    await mockOpenFunc.mock.calls[0][1]();
    expect(mockResetPagingAndSearchData).toBeCalledTimes(1);
    expect(mockResetPagingAndSearchData).toBeCalledWith();
  });

  it('Should show modal error when click confirm YES', async () => {
    // Arrange
    const mockGetDataForConfirmAutoUnmarkFunc = jest.fn().mockImplementation(() => Promise.resolve(Helper.fakeConfirmAutoUnmarkViewModel));
    const mockUpdateConfirmAutoUnmark = jest.fn().mockImplementation(() => ({ errorCode: 1, errorMsg: 'abc' } as Result<null>));
    const mockConfirmFunc = jest.fn();
    const mockOpenFunc = jest.fn();
    const mockGetSportsTypeFunc = jest.fn().mockImplementation(() => (sportInfos));

    const { instance } = await shallow
      .mock(AppService, {
        getDataForConfirmAutoUnmark: mockGetDataForConfirmAutoUnmarkFunc,
        updateConfirmAutoUnmark: mockUpdateConfirmAutoUnmark,
      })
      .mock(CommonService, {
        getSportsType: mockGetSportsTypeFunc,
      })
      .mock(ModalService, {
        confirm: mockConfirmFunc,
        open: mockOpenFunc
      })
      .render();

    instance.onClickConfirm(Helper.fakeConfirmAutoUnmarkViewModel.items[0]);

    // Act
    await mockConfirmFunc.mock.calls[0][1]();

    // Assert
    expect(mockConfirmFunc).toBeCalledTimes(1);
    expect(instance.autoRefreshMode).toBe(AutoRefreshMode.STOP);
    expect(mockUpdateConfirmAutoUnmark).toBeCalledTimes(1);
    expect(mockUpdateConfirmAutoUnmark).toBeCalledWith({
      betId: 7,
      betType: 11,
      markedBy: 232,
      matchId: '1999'
    } as UpdateConfirmAutoUnmark);
    expect(mockOpenFunc).toBeCalledTimes(1);
    expect(mockOpenFunc.mock.calls[0][0]).toStrictEqual(
      {
        message: 'abc',
        title: 'Auto Unmark',
        type: ModalType.Error
      }
    );
  });

  it('#resetPagingAndSearchData should call #searchData', async () => {
    // Arrange
    const { instance } = await shallow
    .mock(CheckValidateService, { checkValidMatch : jest.fn().mockImplementation(() => Promise.resolve(true)) })
    .render();
    instance.searchData = jest.fn();
    instance.tooltip = new Tooltip();
    instance.tooltip.display = jest.fn();

    // Act
    await instance.resetPagingAndSearchData();

    // Assert
    expect(instance.searchData).toHaveBeenCalledTimes(1);
  });

  it('#resetPagingAndSearchData should display tooltip', async () => {
    // Arrange
    const { instance } = await shallow
    .mock(CheckValidateService, { checkValidMatch : jest.fn().mockImplementation(() => Promise.resolve(false)) })
    .render();
    instance.searchData = jest.fn();
    instance.tooltip = new Tooltip();
    instance.tooltip.display = jest.fn();

    // Act
    await instance.resetPagingAndSearchData();

    // Assert
    expect(instance.tooltip.display).toHaveBeenCalledTimes(1);
  });

  it('#searchData should call #getDataForConfirmAutoUnmark', async () => {
    // Arrange
    const mockGetDataForConfirmAutoUnmarkFunc = jest.fn().mockImplementation(() => Promise.resolve(Helper.fakeConfirmAutoUnmarkViewModel));
    const { instance } = await shallow
    .mock(AppService, {
      getDataForConfirmAutoUnmark: mockGetDataForConfirmAutoUnmarkFunc,
    })
    .render();
    instance.query = new ConfirmAutoUnmarkQuery();

    // Act
    await instance.searchData();

    // Assert
    expect(mockGetDataForConfirmAutoUnmarkFunc).toHaveBeenCalledTimes(1);
  });

  it('#getTotalItemsOfModels should return total', async () => {
    // Arrange
    const { instance } = await shallow.render();
    instance.models = Helper.fakeConfirmAutoUnmarkViewModel.items;

    // Act
    const actual = instance.getTotalItemsOfModels();

    // Assert
    expect(actual).toBe(33);
  });

  it('#isShowConfirm should return true', async () => {
    // Arrange
    const { instance } = await shallow.render();

    // Act
    const actual = instance.isShowConfirm(MarkType.ADD_REQUEST);

    // Assert
    expect(actual).toBeTruthy();
  });

  it('#convertToGMT8 should return time GMT8', async () => {
    // Arrange
    const date = new Date('2023-05-29 00:00:00.000');
    const expected = new Date('2023-05-29 12:00:00.000');
    const { instance } = await shallow.render();

    // Act
    const actual = instance.convertToGMT8(date);

    // Assert
    expect(actual).toEqual(expected);
  });

  it('#replaceErrorMessageLockMatch should return error msg of lock match', async () => {
    // Arrange
    const result = new Result<null>();
    result.errorCode = 101;
    result.errorMsg = 'lock match';
    const expected = 'Some tickets cannot be processed because: lock match';
    const { instance } = await shallow.render();

    // Act
    const actual = instance['replaceErrorMessageLockMatch'](result);

    // Assert
    expect(actual).toBe(expected);
  });

  it('#getMatchId should return main matchId and child matchId', async () => {
    // Arrange
    const { instance } = await shallow.render();

    // Act
    const actual = instance.getMatchId('1000', '1001');

    // Assert
    expect(actual).toBe('1000\n(1001)');
  });

  it('#getMatchId should return main matchId', async () => {
    // Arrange
    const { instance } = await shallow.render();

    // Act
    const actual = instance.getMatchId('1000', null);

    // Assert
    expect(actual).toBe('1000');
  });
});
