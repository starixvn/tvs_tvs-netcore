import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { Shallow } from 'shallow-render';
import { AutoRefreshComponent } from '../../../utility/components/auto-refresh/auto-refresh.component';
import { AutoRefreshMode } from '../../../utility/components/auto-refresh/auto-refresh.model';
import { NumbersOnlyDirective } from '../../../utility/directives/numbers-only.directive';
import { SportInfo } from '../../../utility/models/event.model';
import { Result } from '../../../utility/models/result';
import { Selection } from '../../../utility/models/selection.model';
import { BlockUiModule } from '../../../utility/modules/block-ui/block-ui.module';
import { ModalType } from '../../../utility/modules/modal/modal';
import { ModalService } from '../../../utility/modules/modal/modal.service';
import { PagingModule } from '../../../utility/modules/paging/paging.module';
import { PagingComponent } from '../../../utility/modules/paging/paging/paging.component';
import { PagingConstant, PagingModel } from '../../../utility/modules/paging/paging/paging.model';
import { AppService } from '../app.service';
import { ConfirmAutoUnmarkComponent } from './confirm-auto-unmark.component';
import { ConfirmAutoUnmarkViewModel, UpdateConfirmAutoUnmark } from './confirm-auto-unmark.model';

class Helper {
  static readonly matchIdSelector = 'input.match-id';
  static readonly excludeTestSelector = 'input.checkbox-exclude-test';
  static readonly searchButtonSelector = 'input.btn-search';
  static getFakeConfirmAutoUnmarkViewModel(): ConfirmAutoUnmarkViewModel {
    return {
      totalItems: 29,
      items: [
        {
          no: 1, matchId: '1999', kickOffTime: new Date('2020-04-30'), sportName: 'sportname', event: 'eventname', htScore: '1-1', betId: 7,
          ftScore: 'x', userId: 232, markedBy: 'sa', bettype: 11, bettypeName: 'hdp', totalItems: 11, isConfirm: false, markType: 1
        },
        {
          no: 2, matchId: '22229', kickOffTime: new Date('2020-03-10'), sportName: 'sportname2', event: 'eventname2', htScore: '2-2', ftScore: '2',
          userId: 222, markedBy: 'sa22', bettype: 22, bettypeName: 'OU', betId: 7, totalItems: 22, isConfirm: true, markType: 1
        },
      ]
    } as ConfirmAutoUnmarkViewModel;
  }
}

@NgModule({
  declarations: [ConfirmAutoUnmarkComponent, NumbersOnlyDirective, AutoRefreshComponent],
  imports: [
    BlockUiModule,
    FormsModule,
    NgSelectModule,
    PagingModule
  ],
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
      .mock(AppService, {
        getSportsType: mockGetSportsTypeFunc,
      })
      .mock(ModalService, {});
  });

  it('ConfirmAutoUnmarkComponent init should match snapshot with expected data', async () => {
    const mockGetDataForConfirmAutoUnmarkFunc = jest.fn().mockImplementation(() => (Helper.getFakeConfirmAutoUnmarkViewModel()));
    const mockGetSportsTypeFunc = jest.fn().mockImplementation(() => (sportInfos));
    const { fixture, instance } = await shallow
      .mock(AppService, {
        getDataForConfirmAutoUnmark: mockGetDataForConfirmAutoUnmarkFunc,
        getSportsType: mockGetSportsTypeFunc,
      })
      .render();

    expect(fixture).toMatchSnapshot();
    expect(instance.isBlock).toBe(false);
    expect(instance.sportOptions).toStrictEqual(sportSelection);
    expect(instance.selectedSports).toStrictEqual(sportSelection.map(x => x.value));
    expect(instance.markedByOptions).toStrictEqual([{ name: '<<<< Me >>>>', value: '8' }, { name: 'All', value: '0' }]);
    const expectedPaging = new PagingModel();
    expectedPaging.pageSize = PagingConstant.SIZE_ONE;
    expectedPaging.total = Helper.getFakeConfirmAutoUnmarkViewModel().totalItems;
    expect(instance.paging).toStrictEqual(expectedPaging);
    expect(instance.autoRefreshMode).toStrictEqual(AutoRefreshMode.START_OVER);
    expect(instance.query.matchId).toBeNull();
    expect(instance.query.isExcludeTest).toBe(true);
    expect(instance.query.pageIndex).toBe(instance.paging.page - 1);
    expect(instance.query.pageSize).toBe(instance.paging.pageSize);
    expect(instance.query.sporttype).toStrictEqual(instance.selectedSports.join(','));
    expect(instance.query.markedBy).toStrictEqual('8');
    expect(instance.models).toStrictEqual(Helper.getFakeConfirmAutoUnmarkViewModel().items);
    expect(mockGetDataForConfirmAutoUnmarkFunc).toBeCalledTimes(1);
    expect(mockGetDataForConfirmAutoUnmarkFunc).toBeCalledWith(instance.query);
  });

  it('ConfirmAutoUnmarkComponent init should match snapshot with no data', async () => {
    const { fixture } = await shallow
      .render();

    expect(fixture).toMatchSnapshot();
  });

  // it('ConfirmAutoUnmarkComponent init html template should render with correct model', async () => {
  //   const mockGetDataForConfirmAutoUnmarkFunc = jest.fn().mockImplementation(() => (Helper.getFakeConfirmAutoUnmarkViewModel()));
  //   const { instance, find, findComponent, findDirective } = await shallow
  //     .dontMock(NgSelectComponent)
  //     .mock(AppService, {
  //       getDataForConfirmAutoUnmark: mockGetDataForConfirmAutoUnmarkFunc,
  //      })
  //     .render();

  //   const matchId = find(Helper.matchIdSelector);
  //   const sport = findComponent(NgSelectComponent)[0];
  //   const markedBy = findComponent(NgSelectComponent)[1];
  //   const excludeTest = find(Helper.excludeTestSelector);
  //   const autoRefresh = findComponent(AutoRefreshComponent);
  //   const blockUi = findDirective(BlockUiDirective);
  //   const numberOnly = findDirective(NumbersOnlyDirective);
  //   const paging = findComponent(PagingComponent);

  //   expect(matchId.nativeElement.value).toBe('');
  //   expect(matchId).toHaveFoundOne();
  //   expect(sport.items).toStrictEqual(sportSelection);
  //   expect(sport.selectedValues).toStrictEqual(sportSelection);
  //   expect(sport.multiple).toBe(true);
  //   expect(markedBy.items).toStrictEqual([{ name: '<<<< Me >>>>', value: '8' }, { name: 'All', value: '0' }]);
  //   expect(markedBy.selectedValues).toStrictEqual([{ name: '<<<< Me >>>>', value: '8' }]);
  //   expect(markedBy.multiple).toBe(false);
  //   expect(excludeTest.properties.checked).toBe(instance.query.isExcludeTest);
  //   expect(autoRefresh.mode).toBe(instance.autoRefreshMode);
  //   expect(autoRefresh).toHaveFoundOne();
  //   expect(blockUi).toHaveFoundOne();
  //   expect(blockUi.isBlock).toBe(instance.isBlock);
  //   expect(numberOnly).toHaveFoundOne();
  //   expect(paging.model).toBe(instance.paging);
  //   expect(paging).toHaveFoundOne();
  // });

  // it('Props query.matchId should be changed when change input match-id', async () => {
  //   const { instance, find } = await shallow
  //     .dontMock(NgSelectComponent)
  //     .render();

  //   const matchId = find(Helper.matchIdSelector);
  //   matchId.nativeElement.value = '222';
  //   matchId.triggerEventHandler('input', { target: matchId.nativeElement });

  //   expect(instance.query.matchId).toStrictEqual('222');
  // });

  // it('Props selectedSports should be changed when change Sport selection', async () => {
  //   const { instance, findComponent } = await shallow
  //     .dontMock(NgSelectComponent)
  //     .render();

  //   const sport = findComponent(NgSelectComponent)[0];
  //   sport.select(sport.itemsList.items[1]);

  //   expect(instance.selectedSports).toStrictEqual(['1', '2']);
  // });

  // it('Props query.markBy should be changed when change Mark By selection', async () => {
  //   const { instance, findComponent } = await shallow
  //     .dontMock(NgSelectComponent)
  //     .render();

  //   const markedBy = findComponent(NgSelectComponent)[1];
  //   markedBy.select(markedBy.itemsList.items[1]);

  //   expect(instance.query.markedBy).toStrictEqual('0');
  // });

  // it('Props query.isExcludeTest should be changed when change Is Exclude Test checkbox', async () => {
  //   const { instance, find } = await shallow
  //     .dontMock(NgSelectComponent)
  //     .render();

  //   const excludeTest = find(Helper.excludeTestSelector);
  //   excludeTest.nativeElement.checked = false;
  //   excludeTest.nativeElement.dispatchEvent(new Event('change'));

  //   expect(instance.query.isExcludeTest).toBe(false);
  // });

  it('Click search button should call #resetPagingAndSearchData', async () => {
    const { instance, find, } = await shallow
      .render();
    const spyResetPagingAndSearchData = jest.spyOn(instance, 'resetPagingAndSearchData');
    const mockSearchData = jest.fn();
    instance.searchData = mockSearchData;

    const searchButton = find(Helper.searchButtonSelector);
    searchButton.triggerEventHandler('click', {});

    expect(spyResetPagingAndSearchData).toBeCalledTimes(1);
    expect(spyResetPagingAndSearchData).toBeCalledWith();
    const expectedPaging = new PagingModel();
    expectedPaging.pageSize = PagingConstant.SIZE_ONE;
    expect(instance.paging).toStrictEqual(expectedPaging);
    expect(mockSearchData).toBeCalledTimes(1);
    expect(mockSearchData).toBeCalledWith();
  });

  it('AutoRefreshComponent should call #onCountdownRefreshEnd when emit (countdownEnd) event', async () => {
    const mockCloseFunc = jest.fn();
    const { instance, findComponent } = await shallow
      .mock(ModalService, { close: mockCloseFunc })
      .render();
    const spyOnCountdownRefreshEnd = jest.spyOn(instance, 'onCountdownRefreshEnd');
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

  it('PagingComponent should call #searchData when emit (modelChange) event', async () => {
    const { instance, findComponent } = await shallow
      .render();
    const mockSearchData = jest.fn();
    instance.searchData = mockSearchData;

    const paging = findComponent(PagingComponent);
    paging.modelChange.emit();

    expect(paging).toHaveFound(1);
    expect(mockSearchData).toBeCalledTimes(1);
    expect(mockSearchData).toBeCalledWith();
  });

  it('Should show confirm modal when click Confirm button', async () => {
    const mockGetDataForConfirmAutoUnmarkFunc = jest.fn().mockImplementation(() => (Helper.getFakeConfirmAutoUnmarkViewModel()));
    const mockConfirmFunc = jest.fn();
    const { instance, find } = await shallow
      .mock(AppService, { getDataForConfirmAutoUnmark: mockGetDataForConfirmAutoUnmarkFunc })
      .mock(ModalService, { confirm: mockConfirmFunc })
      .render();

    const spyOnClickConfirm = jest.spyOn(instance, 'onClickConfirm');
    const confirmButton = find('button.button-confirm')[0];
    confirmButton.triggerEventHandler('click', {});

    expect(spyOnClickConfirm).toBeCalledTimes(1);
    expect(spyOnClickConfirm).toBeCalledWith(Helper.getFakeConfirmAutoUnmarkViewModel().items[0]);
    expect(mockConfirmFunc).toBeCalledTimes(1);
    expect(mockConfirmFunc.mock.calls[0][0]).toMatchSnapshot();
    expect(mockConfirmFunc.mock.calls[0][1]).toBeInstanceOf(Function);
  });

  it('Should show modal Confirm Auto Unmark successfully when click confirm YES', async () => {
    // Arrange
    const mockGetDataForConfirmAutoUnmarkFunc = jest.fn().mockImplementation(() => (Helper.getFakeConfirmAutoUnmarkViewModel()));
    const mockUpdateConfirmAutoUnmark = jest.fn().mockImplementation(() => ({ errorCode: 0, isSuccessful: true } as Result<null>));
    const mockConfirmFunc = jest.fn();
    const mockOpenFunc = jest.fn();
    const { instance, find } = await shallow
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
    const confirmButton = find('button.button-confirm')[0];
    confirmButton.triggerEventHandler('click', {});

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
    const mockGetDataForConfirmAutoUnmarkFunc = jest.fn().mockImplementation(() => (Helper.getFakeConfirmAutoUnmarkViewModel()));
    const mockUpdateConfirmAutoUnmark = jest.fn().mockImplementation(() => ({ errorCode: 1, errorMsg: 'abc' } as Result<null>));
    const mockConfirmFunc = jest.fn();
    const mockOpenFunc = jest.fn();
    const mockGetSportsTypeFunc = jest.fn().mockImplementation(() => (sportInfos));

    const { instance, find } = await shallow
      .mock(AppService, {
        getDataForConfirmAutoUnmark: mockGetDataForConfirmAutoUnmarkFunc,
        updateConfirmAutoUnmark: mockUpdateConfirmAutoUnmark,
        getSportsType: mockGetSportsTypeFunc
      })
      .mock(ModalService, {
        confirm: mockConfirmFunc,
        open: mockOpenFunc
      })
      .render();

    const confirmButton = find('button.button-confirm')[0];
    confirmButton.triggerEventHandler('click', {});

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
});
