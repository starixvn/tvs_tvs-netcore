import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalService } from '../../../utility/components/modal/modal.service';
import { Tooltip } from '../../../utility/components/tooltip/tooltip.model';
import { MarkType } from '../../../utility/constants/config';
import { SportInfo } from '../../../utility/models/event.model';
import { Result } from '../../../utility/models/result';
import { Selection } from '../../../utility/models/selection.model';
import { CommonService } from '../../../utility/services/common.service';
import { AppService } from '../app.service';
import { CheckValidateService } from '../services/check-validate.service';
import { ConfirmAutoUnmarkComponent } from './confirm-auto-unmark.component';
import { ConfirmAutoUnmarkViewModel, GetDataForConfirmAutoUnmarkViewModel, UpdateConfirmAutoUnmark } from './confirm-auto-unmark.model';
import { AutoRefreshMode } from '../../../utility/components/auto-refresh/auto-refresh.model';
import { TestingModule } from '../../../utility/modules/testing.module';

class Helper {
  static readonly matchIdSelector = 'input.match-id';
  static readonly excludeTestSelector = 'input.checkbox-exclude-test';
  static readonly searchButtonSelector = 'button.btn-search';
  static readonly confirmButtonSelector = 'button.btn-confirm';

  static readonly fakeConfirmAutoUnmarkViewModel: GetDataForConfirmAutoUnmarkViewModel = {
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

  static readonly sportInfos: SportInfo[] = [{
    sportName: 'sport1',
    sportType: 1
  },
  {
    sportName: 'sport2',
    sportType: 2
  }];

  static readonly sportSelection: Array<Selection> = [{
    group: 'All',
    name: 'sport1',
    value: '1',
  },
  {
    group: 'All',
    name: 'sport2',
    value: '2',
  }];
}

describe('ConfirmAutoUnmarkComponent', () => {
  let component: ConfirmAutoUnmarkComponent;
  let fixture: ComponentFixture<ConfirmAutoUnmarkComponent>;
  let appService: AppService;
  let commonService: CommonService;
  let modalService: ModalService;
  let checkValidateService: CheckValidateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TestingModule
      ],
      providers: [
        CommonService,
        ModalService,
        AppService,
        CheckValidateService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmAutoUnmarkComponent);
    appService = fixture.debugElement.injector.get(AppService);
    commonService = fixture.debugElement.injector.get(CommonService);
    modalService = fixture.debugElement.injector.get(ModalService);
    checkValidateService = fixture.debugElement.injector.get(CheckValidateService);
    component = fixture.componentInstance;

    const element = document.createElement('body');
    element.setAttribute('id', 'body');
    element.setAttribute('user-id', '8');
    document.body.appendChild(element);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', async () => {
    // Arrange    
    appService.getDataForConfirmAutoUnmark = jest.fn().mockImplementation(() => Promise.resolve(Helper.fakeConfirmAutoUnmarkViewModel));;
    commonService.getSportsType = jest.fn().mockImplementation(() => (Helper.sportInfos));
    component.tooltip = new Tooltip();
    component.tooltip.display = jest.fn();

    // Act
    await component.ngOnInit();

    // Assert
    expect(component.isBlock).toBe(false);
    expect(component.sportOptions).toStrictEqual(Helper.sportSelection);
    expect(component.selectedSports).toStrictEqual(Helper.sportSelection.map(x => x.value));
    expect(component.markedByOptions).toStrictEqual([{ name: '<<<< Me >>>>', value: '8' }, { name: 'All', value: '0' }]);
    expect(component.query.matchId).toBeNull();
    expect(component.query.isExcludeTest).toBe(true);
    expect(component.query.pageIndex).toBe(component.paging.page - 1);
    expect(component.models).toStrictEqual(Helper.fakeConfirmAutoUnmarkViewModel.items);
  });

  it('should handle search button click', async () => {
    // Arrange
    checkValidateService.checkValidMatch = jest.fn().mockImplementation(() => Promise.resolve(false));
    component.searchData = jest.fn();
    component.tooltip = new Tooltip();
    component.tooltip.display = jest.fn();

    // Act
    await component.resetPagingAndSearchData();

    // Assert
    expect(component.tooltip.display).toHaveBeenCalledTimes(1);
  });

  it('should handle auto refresh countdown end', async () => {
    // Arrange
    const mockCloseFunc = jest.fn();
    modalService.close = mockCloseFunc;
    component.resetPagingAndSearchData = jest.fn();
    component.tooltip = new Tooltip();
    component.tooltip.display = jest.fn();

    // Act
    component.onCountdownRefreshEnd();

    // Assert
    expect(mockCloseFunc).toHaveBeenCalled();
    expect(component.resetPagingAndSearchData).toHaveBeenCalled();
  });

  it('should show confirm modal when clicking confirm', async () => {
    // Arrange
    const mockConfirmFunc = jest.fn();
    modalService.confirm = mockConfirmFunc;

    // Act
    component.onClickConfirm(new ConfirmAutoUnmarkViewModel());

    // Assert
    expect(mockConfirmFunc).toHaveBeenCalled();
  });

  it('should handle successful confirm auto unmark', async () => {
    // Arrange
    const mockConfirmFunc = jest.fn().mockImplementation((_, callback) => callback());
    appService.updateConfirmAutoUnmark = jest.fn().mockImplementation(() => Promise.resolve({ errorCode: 0, isSuccessful: true } as Result<null>));
    modalService.open = jest.fn();
    modalService.confirm = mockConfirmFunc;
    component.resetPagingAndSearchData = jest.fn();
    component.autoRefreshMode = AutoRefreshMode.STOP;

    // Act
    component.onClickConfirm(Helper.fakeConfirmAutoUnmarkViewModel.items[0]);
    await new Promise(resolve => setTimeout(resolve, 0));

    // Assert
    expect(appService.updateConfirmAutoUnmark).toHaveBeenCalledWith({
      betId: 7,
      betType: 11,
      markedBy: 232,
      matchId: '1999'
    } as UpdateConfirmAutoUnmark);
    expect(modalService.open).toHaveBeenCalled();
  });

  it('should handle error when confirming auto unmark', async () => {
    // Arrange
    appService.updateConfirmAutoUnmark = jest.fn().mockImplementation(() => Promise.resolve({ errorCode: 1, errorMsg: 'abc' } as Result<null>));
    modalService.open = jest.fn();
    modalService.confirm = jest.fn().mockImplementation((_, callback) => callback());
    component.autoRefreshMode = AutoRefreshMode.STOP;

    // Act
    component.onClickConfirm(Helper.fakeConfirmAutoUnmarkViewModel.items[0]);
    await new Promise(resolve => setTimeout(resolve, 0));

    // Assert
    expect(modalService.open).toHaveBeenCalled();
  });

  it('should get total items of models', () => {
    // Arrange
    component.models = Helper.fakeConfirmAutoUnmarkViewModel.items;

    // Act
    const actual = component.getTotalItemsOfModels();

    // Assert
    expect(actual).toBe(33);
  });

  it('should check if show confirm', () => {
    // Act
    const actual = component.isShowConfirm(MarkType.ADD_REQUEST);

    // Assert
    expect(actual).toBeTruthy();
  });

  it('should convert time to GMT8', () => {
    // Arrange
    const date = new Date('2023-05-29 00:00:00.000');
    const expected = new Date('2023-05-29 12:00:00.000');

    // Act
    const actual = component.convertToGMT8(date);

    // Assert
    expect(actual).toEqual(expected);
  });

  it('should replace error message for lock match', () => {
    // Arrange
    const result = new Result<null>();
    result.errorCode = 101;
    result.errorMsg = 'lock match';
    const expected = 'Some tickets cannot be processed because: lock match';

    // Act
    const actual = component['replaceErrorMessageLockMatch'](result);

    // Assert
    expect(actual).toBe(expected);
  });

  it('should get match ID with child match ID', () => {
    // Act
    const actual = component.getMatchId('1000', '1001');

    // Assert
    expect(actual).toBe('1000\n(1001)');
  });

  it('should get match ID without child match ID', () => {
    // Act
    const actual = component.getMatchId('1000', null);

    // Assert
    expect(actual).toBe('1000');
  });
});
