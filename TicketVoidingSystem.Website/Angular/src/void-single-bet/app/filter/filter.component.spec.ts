import { BalanceUp } from '../../../utility/models/balance-up.model';
import { IssueType, IssueTypesModel, SubIssueType } from '../../../utility/models/issue-type.model';
import { Selection } from '../../../utility/models/selection.model';
import { CommonService } from '../../../utility/services/common.service';
import { FilterComponent } from './filter.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../utility/modules/testing.module';
import { AppService } from '../app.service';
import { EventEmitter } from '@angular/core';
import { Type } from './filter.model';
import { FilterService } from './filter.service';

class Helper {
  static readonly fakeDate = '2020-11-09 12:08:49.737';
  static readonly requestIdInputSelector = '.input-request-id';
  static readonly matchIdInputSelector = '.input-match-id';
  static readonly newRequestButtonSelector = '.btn-success';
  static readonly fakeIssueTypeSelectList: Selection[] = [
    {
      name: 'Abnormal Bet',
      value: '11'
    },
    {
      name: 'Early Kick Off',
      value: '8'
    },
    {
      name: 'Wrong Kick Off Time',
      value: '9'
    }
  ];
  static readonly fakeCreatedBySelectList: Selection[] = [
    {
      name: 'Zane',
      value: '11'
    },
    {
      name: 'Raymond',
      value: '112'
    }
  ];
  static readonly fakeIssueTypeList: IssueType[] = [
    { issueTypeId: 11, issueTypeName: 'Abnormal Bet' },
    { issueTypeId: 8, issueTypeName: 'Early Kick Off' },
    { issueTypeId: 9, issueTypeName: 'Wrong Kick Off Time' }
  ];
  static readonly fakeSubIssueTypeList: SubIssueType[] = [
    {
      subIssueTypeId: 27,
      issueTypeId: 11,
      subIssueTypeName: 'Abnormal',
      subIssueTypeNameCS: '非正常'
    },
    {
      subIssueTypeId: 12,
      issueTypeId: 8,
      subIssueTypeName: 'Non Live',
      subIssueTypeNameCS: ''
    },
    {
      subIssueTypeId: 14,
      issueTypeId: 9,
      subIssueTypeName: 'Wrong Kick Off Time',
      subIssueTypeNameCS: ''
    }
  ];
  static readonly fakeIssueTypesModel: IssueTypesModel = {
    issueTypes: Helper.fakeIssueTypeList,
    subIssueTypes: Helper.fakeSubIssueTypeList
  };

  static readonly fakeBalanceUp: BalanceUp = {
    balanceUpDay: new Date('2020-01-16'),
    moveBetsDay: new Date('2020-01-26')
  };
  static readonly year = 2025;
  static readonly month = 2;
  static readonly date = 6;
}

describe('FilterComponent', () => {
  let component: FilterComponent;
  let fixture: ComponentFixture<FilterComponent>;
  let commonService: CommonService;
  let appService: AppService;
  let filterService: FilterService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TestingModule
      ],
      providers: [
        CommonService,
        AppService,
        FilterService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FilterComponent);
    commonService = fixture.debugElement.injector.get(CommonService);
    appService = fixture.debugElement.injector.get(AppService);
    filterService = fixture.debugElement.injector.get(FilterService);
    component = fixture.componentInstance;
  });

  it('#ngOnInit should call expected function', async () => {
    // Arrange
    component.initFilter = jest.fn();

    // Action
    await component.ngOnInit();

    // Assert
    expect(component.initFilter).toHaveBeenCalledTimes(1);
  });

  it('#renderComboParlay should set expected data', async () => {
    // Action
    (component as any).renderComboParlay();

    // Assert
    expect(component.comboParlay).toBeDefined();
    expect(component.selectedComboParlay).toEqual([]);
  });

  it('#resetCheckedComboParlay should set expected data', async () => {
    // Arrange
    component.comboParlay = [
      { value: '1', name: 'Test 1' },
      { value: '2', name: 'Test 2' }
    ];

    // Action
    (component as any).resetCheckedComboParlay();

    // Assert
    expect(component.selectedComboParlay).toEqual(['1', '2']);
  });

  it('#setDateTime should set expected data', async () => {
    // Action
    (component as any).setDateTime();

    // Assert
    expect(component.fromDateTime).toBeDefined();
    expect(component.toDateTime).toBeDefined();
  });

  it('#initFilter should call expected functions', async () => {
    // Arrange
    (component as any).setDateTime = jest.fn();
    (component as any).renderComboParlay = jest.fn();
    (component as any).initBet = jest.fn();
    (component as any).getRemark = jest.fn();
    component.getIssueTypes = jest.fn().mockResolvedValue(Helper.fakeIssueTypesModel);
    (component as any).renderTicketType = jest.fn();
    component.renderEventType = jest.fn();
    component.renderOddsType = jest.fn();
    component.renderSettledType = jest.fn();
    component.renderGroupBetTypesHandler = jest.fn();
    (component as any).renderIssueType = jest.fn();
    (component as any).renderSubIssueType = jest.fn();
    component.issueTypeModel = Helper.fakeIssueTypesModel;
    
    component.subIssueType = {
      items: Helper.fakeSubIssueTypeList.map(item => ({
        value: item.subIssueTypeId.toString(),
        name: item.subIssueTypeName
      })),
      value: Helper.fakeSubIssueTypeList[0].subIssueTypeId.toString()
    } as unknown as Type;
    
    component.issueType = {
      items: Helper.fakeIssueTypeList.map(item => ({
        value: item.issueTypeId.toString(),
        name: item.issueTypeName
      })),
      value: Helper.fakeIssueTypeList[0].issueTypeId.toString()
    };

    component.updateIssueTypeEvent = new EventEmitter<number>();
    component.changeSubIssueTypeEvent = jest.fn();

    // Action
    await component.initFilter();

    // Assert
    expect((component as any).setDateTime).toHaveBeenCalledTimes(1);
    expect((component as any).renderComboParlay).toHaveBeenCalledTimes(1);
    expect((component as any).initBet).toHaveBeenCalledTimes(1);
    expect((component as any).getRemark).toHaveBeenCalledTimes(1);
    expect(component.getIssueTypes).toHaveBeenCalledTimes(1);
    expect((component as any).renderTicketType).toHaveBeenCalledTimes(1);
    expect(component.renderEventType).toHaveBeenCalledTimes(1);
    expect(component.renderOddsType).toHaveBeenCalledTimes(1);
    expect(component.renderSettledType).toHaveBeenCalledTimes(1);
    expect(component.renderGroupBetTypesHandler).toHaveBeenCalledTimes(1);
    expect((component as any).renderIssueType).toHaveBeenCalledTimes(1);
    expect((component as any).renderSubIssueType).toHaveBeenCalledTimes(1);
  });

  it('#initBet should set expected data', async () => {
    // Arrange
    component.changeControlBet = jest.fn();

    // Action
    (component as any).initBet();

    // Assert
    expect(component.bet.value).toBe('All');
    expect(component.changeControlBet).toHaveBeenCalledWith('All');
  });

  it('#getRemark should set expected data', async () => {
    // Arrange
    const expectedRemark = ['Test 1', 'Test 2'];
    appService.getRemark = jest.fn().mockResolvedValue(expectedRemark);

    // Action
    await (component as any).getRemark();

    // Assert
    expect(component.remark).toEqual(expectedRemark);
  });

  it('#getIssueTypes should set expected data', async () => {
    // Arrange
    const mockData = Helper.fakeIssueTypesModel;
    const updatedData = Helper.fakeIssueTypesModel;
    commonService.getIssueTypes = jest.fn().mockResolvedValue(mockData);
    filterService.updateIssueTypes = jest.fn().mockReturnValue(updatedData);
    component.issueTypeModel = undefined;

    // Action
    await component.getIssueTypes();

    // Assert
    expect(component.issueTypeModel).toBeDefined();
    expect(filterService.updateIssueTypes).toHaveBeenCalledWith(mockData);
  });

  it('#renderTicketType should set expected data', async () => {
    // Action
    (component as any).renderTicketType();

    // Assert
    expect(component.ticketType.items.length).toBe(3);
    expect(component.ticketType.value).toBe('0');
  });

  it('#renderIssueType should set expected data when issueTypeModel exists', () => {
    // Arrange
    component.issueTypeModel = Helper.fakeIssueTypesModel;
    component.issueType = new Type();

    // Action
    (component as any).renderIssueType();

    // Assert
    expect(component.issueType.items).toHaveLength(3);
    expect(component.issueType.value).toBe(Helper.fakeIssueTypeList[0].issueTypeId.toString());
  });

  it('#renderIssueType should not set data when issueTypeModel is null', () => {
    // Arrange
    component.issueTypeModel = null;
    component.issueType = new Type();

    // Action
    (component as any).renderIssueType();

    // Assert
    expect(component.issueType.items).toBeUndefined();
  });

  it('#renderSubIssueType should call changeIssueTypeEvent when issueType has value', () => {
    // Arrange
    component.issueType = { value: '11' } as Type;
    component.changeIssueTypeEvent = jest.fn();

    // Action
    (component as any).renderSubIssueType();

    // Assert
    expect(component.changeIssueTypeEvent).toHaveBeenCalledTimes(1);
  });

  it('#renderSubIssueType should not call changeIssueTypeEvent when issueType has no value', () => {
    // Arrange
    component.issueType = { value: '' } as Type;
    component.changeIssueTypeEvent = jest.fn();

    // Action
    (component as any).renderSubIssueType();

    // Assert
    expect(component.changeIssueTypeEvent).not.toHaveBeenCalled();
  });

  it('#changeEventType should call filterService and emit event', () => {
    // Arrange
    component.eventType = { value: '1' } as Type;
    component.issueType = { value: '11' } as Type;
    component.subIssueType = { value: '27' } as Type;
    component.allBetTypes = [];
    component.groupBetTypes = { groupBetTypes: [] } as any;
    filterService.handleBetTypeOfBasketball = jest.fn();
    component.updateEventType = new EventEmitter<string>();
    jest.spyOn(component.updateEventType, 'emit');

    // Action
    component.changeEventType();

    // Assert
    expect(filterService.handleBetTypeOfBasketball).toHaveBeenCalledWith('1', '11', '27', [], { groupBetTypes: [] });
    expect(component.updateEventType.emit).toHaveBeenCalledWith('1');
  });

  it('#changeIssueTypeEvent should filter sub issue types and emit events', () => {
    // Arrange
    component.issueTypeModel = Helper.fakeIssueTypesModel;
    component.issueType = { value: '11' } as Type;
    component.subIssueType = new Type();
    component.updateIssueTypeEvent = new EventEmitter<number>();
    component.changeSubIssueTypeEvent = jest.fn();
    jest.spyOn(component.updateIssueTypeEvent, 'emit');

    // Action
    component.changeIssueTypeEvent();

    // Assert
    // After filtering out '27', '39', '41', there should be 0 items left for issueTypeId 11
    expect(component.subIssueType.items).toHaveLength(0);
    expect(component.subIssueType.value).toBeUndefined();
    expect(component.updateIssueTypeEvent.emit).toHaveBeenCalledWith(11);
    expect(component.changeSubIssueTypeEvent).toHaveBeenCalledTimes(1);
  });

  it('#changeSubIssueTypeEvent should call filterService for basketball and emit event', () => {
    // Arrange
    component.eventType = { value: '1' } as Type;
    component.issueType = { value: '11' } as Type;
    component.subIssueType = { value: '27' } as Type;
    component.allBetTypes = [{ id: 1, isChecked: false }] as any; // Non-empty array
    component.groupBetTypes = { groupBetTypes: [] } as any;
    component.matchViewModel = { sportType: 2 } as any; // Basketball sport type (SportType.BASKETBALL = 2)
    filterService.handleBetTypeOfBasketball = jest.fn();
    component.updateSubIssueTypeEvent = new EventEmitter<number>();
    jest.spyOn(component.updateSubIssueTypeEvent, 'emit');

    // Action
    component.changeSubIssueTypeEvent();

    // Assert
    expect(filterService.handleBetTypeOfBasketball).toHaveBeenCalledWith('1', '11', '27', [{ id: 1, isChecked: false }], { groupBetTypes: [] });
    expect(component.updateSubIssueTypeEvent.emit).toHaveBeenCalledWith(27);
  });

  it('#changeSubIssueTypeEvent should not call filterService for non-basketball sport', () => {
    // Arrange
    component.eventType = { value: '1' } as Type;
    component.issueType = { value: '11' } as Type;
    component.subIssueType = { value: '27' } as Type;
    component.allBetTypes = [];
    component.groupBetTypes = { groupBetTypes: [] } as any;
    component.matchViewModel = { sportType: 1 } as any; // Non-basketball sport type
    filterService.handleBetTypeOfBasketball = jest.fn();
    component.updateSubIssueTypeEvent = new EventEmitter<number>();
    jest.spyOn(component.updateSubIssueTypeEvent, 'emit');

    // Action
    component.changeSubIssueTypeEvent();

    // Assert
    expect(filterService.handleBetTypeOfBasketball).not.toHaveBeenCalled();
    expect(component.updateSubIssueTypeEvent.emit).toHaveBeenCalledWith(27);
  });

  it('#checkFilterParams should return false when filterService methods return true', () => {
    // Arrange
    component.matchId = '';
    component.isSuccessMatch = false;
    component.fromTimeComponent = { validateWithTooltip: jest.fn().mockReturnValue(true) } as any;
    component.toTimeComponent = { validateWithTooltip: jest.fn().mockReturnValue(true) } as any;
    component.fromDateTime = '2023-01-01 10:00:00';
    component.toDateTime = '2023-01-01 11:00:00';
    component.bet = { value: 'Sub Parlay' } as any;
    component.selectedComboParlay = [];
    component.tooltip = { display: jest.fn() } as any;
    component.groupBetTypesComponent = { validate: jest.fn().mockReturnValue(true) } as any;
    component.advancedModeComponent = { validate: jest.fn().mockReturnValue(true) } as any;
    
    filterService.inValidMatch = jest.fn().mockReturnValue(true);
    filterService.isTransDateValidity = jest.fn().mockReturnValue(true);
    filterService.isSelectionNotValid = jest.fn().mockReturnValue(false);

    // Action
    const result = component.checkFilterParams();

    // Assert
    expect(result).toBe(false);
    expect(filterService.inValidMatch).toHaveBeenCalled();
  });

  it('#checkFilterParams should return true when all validations pass', () => {
    // Arrange
    component.matchId = '123';
    component.isSuccessMatch = true;
    component.fromTimeComponent = { validateWithTooltip: jest.fn().mockReturnValue(true) } as any;
    component.toTimeComponent = { validateWithTooltip: jest.fn().mockReturnValue(true) } as any;
    component.fromDateTime = '2023-01-01 10:00:00';
    component.toDateTime = '2023-01-01 11:00:00';
    component.bet = { value: 'All' } as any;
    component.selectedComboParlay = [];
    component.tooltip = { display: jest.fn() } as any;
    component.groupBetTypesComponent = { validate: jest.fn().mockReturnValue(true) } as any;
    component.advancedModeComponent = { validate: jest.fn().mockReturnValue(true) } as any;
    
    filterService.inValidMatch = jest.fn().mockReturnValue(false);
    filterService.isTransDateValidity = jest.fn().mockReturnValue(true);
    filterService.isSelectionNotValid = jest.fn().mockReturnValue(false);

    // Action
    const result = component.checkFilterParams();

    // Assert
    expect(result).toBe(true);
  });

  it('#getParams should call filterService methods', () => {
    // Arrange
    component.matchId = '123';
    component.eventType = { value: '1' } as Type;
    component.liveAwayScore = '1';
    component.liveHomeScore = '2';
    component.isCheckTime = true;
    component.fromDateTime = '2023-01-01 10:00:00';
    component.toDateTime = '2023-01-01 11:00:00';
    component.oddsType = { value: 'DEC' } as Type;
    component.oddsValue = '1.5';
    component.ticketType = { value: '0' } as Type;
    component.settledType = { value: 'All' } as Type;
    component.bet = { value: 'All' } as any;
    component.timeType = 0;
    component.selectedComboParlay = ['1', '2'];
    component.fromTimeComponent = { validateWithTooltip: jest.fn().mockReturnValue(true) } as any;
    component.toTimeComponent = { validateWithTooltip: jest.fn().mockReturnValue(true) } as any;
    component.groupBetTypes = { groupBetTypes: [] } as any;
    component.advancedModeComponent = { getBetTypeModels: jest.fn().mockReturnValue([]) } as any;
    
    filterService.isTransDateValidity = jest.fn().mockReturnValue(true);
    filterService.getSelectionSubParlays = jest.fn().mockReturnValue('1,2');

    // Action
    const result = component.getParams();

    // Assert
    expect(filterService.isTransDateValidity).toHaveBeenCalled();
    expect(filterService.getSelectionSubParlays).toHaveBeenCalledWith('All', ['1', '2']);
    expect(result.matchId).toBe(123);
    expect(result.selectionSubParlays).toBe('1,2');
  });

  it('#isShowSelectionSubParlay should return true when bet is Sub Parlay', () => {
    // Arrange
    component.bet = { value: 'Sub Parlay' } as any;

    // Action
    const result = component.isShowSelectionSubParlay();

    // Assert
    expect(result).toBe(true);
  });

  it('#isShowSelectionSubParlay should return false when bet is not Sub Parlay', () => {
    // Arrange
    component.bet = { value: 'All' } as any;

    // Action
    const result = component.isShowSelectionSubParlay();

    // Assert
    expect(result).toBe(false);
  });
});
