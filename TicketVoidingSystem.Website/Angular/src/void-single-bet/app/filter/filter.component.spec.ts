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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TestingModule
      ],
      providers: [
        CommonService,
        AppService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FilterComponent);
    commonService = fixture.debugElement.injector.get(CommonService);
    appService = fixture.debugElement.injector.get(AppService);
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
    component.renderComboParlay();

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
    component.resetCheckedComboParlay();

    // Assert
    expect(component.selectedComboParlay).toEqual(['1', '2']);
  });

  it('#setDateTime should set expected data', async () => {
    // Action
    component.setDateTime();

    // Assert
    expect(component.fromDateTime).toBeDefined();
    expect(component.toDateTime).toBeDefined();
  });

  it('#initFilter should call expected functions', async () => {
    // Arrange
    component.setDateTime = jest.fn();
    component.renderComboParlay = jest.fn();
    component.initBet = jest.fn();
    component.getRemark = jest.fn();
    component.getIssueTypes = jest.fn().mockResolvedValue(Helper.fakeIssueTypesModel);
    component.renderTicketType = jest.fn();
    component.renderEventType = jest.fn();
    component.renderOddsType = jest.fn();
    component.renderSettledType = jest.fn();
    component.renderGroupBetTypesHandler = jest.fn();
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
    expect(component.setDateTime).toHaveBeenCalledTimes(1);
    expect(component.renderComboParlay).toHaveBeenCalledTimes(1);
    expect(component.initBet).toHaveBeenCalledTimes(1);
    expect(component.getRemark).toHaveBeenCalledTimes(1);
    expect(component.getIssueTypes).toHaveBeenCalledTimes(1);
    expect(component.renderTicketType).toHaveBeenCalledTimes(1);
    expect(component.renderEventType).toHaveBeenCalledTimes(1);
    expect(component.renderOddsType).toHaveBeenCalledTimes(1);
    expect(component.renderSettledType).toHaveBeenCalledTimes(1);
    expect(component.renderGroupBetTypesHandler).toHaveBeenCalledTimes(1);
  });

  it('#initBet should set expected data', async () => {
    // Arrange
    component.changeControlBet = jest.fn();

    // Action
    component.initBet();

    // Assert
    expect(component.bet.value).toBe('All');
    expect(component.changeControlBet).toHaveBeenCalledWith('All');
  });

  it('#getRemark should set expected data', async () => {
    // Arrange
    const expectedRemark = ['Test 1', 'Test 2'];
    appService.getRemark = jest.fn().mockResolvedValue(expectedRemark);

    // Action
    await component.getRemark();

    // Assert
    expect(component.remark).toEqual(expectedRemark);
  });

  it('#getIssueTypes should set expected data', async () => {
    // Arrange
    const mockData = Helper.fakeIssueTypesModel;
    commonService.getIssueTypes = jest.fn().mockResolvedValue(mockData);
    component.issueTypeModel = undefined;

    // Action
    await component.getIssueTypes();

    // Assert
    expect(component.issueTypeModel).toBeDefined();
  });

  it('#renderTicketType should set expected data', async () => {
    // Action
    component.renderTicketType();

    // Assert
    expect(component.ticketType.items.length).toBe(3);
    expect(component.ticketType.value).toBe('0');
  });
});
