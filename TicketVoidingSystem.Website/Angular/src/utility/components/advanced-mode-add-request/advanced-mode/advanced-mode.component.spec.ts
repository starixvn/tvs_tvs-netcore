import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../../utility/modules/testing.module';
import { AdvancedModeComponent } from './advanced-mode.component';
import { CommonService } from '../../../../utility/services/common.service';
import { StaticService } from '../../../../utility/services/static.service';
import { AdvancedModeAddRequestModel } from '../advanced-mode-add-request.model';
import { BetTypeAddRequest } from '../group-bet-types/group-bet-types.model';
import { BetTeamAddRequest, Selection, MultiSelection } from './advanced-mode.model';
import { SimpleChange } from '@angular/core';
import { MultipleSelectionService } from '../../multiple-selection/multiple-selection.service';
import { ItemsSelectService } from '../../multiple-selection/items-select.service';
import { OddsInfo } from '../../advanced-mode/advanced-mode/advanced-mode.model';
import { MultipleSelection } from '../../multiple-selection/multiple-selection.model';
import { ControlsAllBetTypes } from '../controls-all-bet-types/controls-all-bet-types.model';

class Helper {
  static readonly fakeMatchId = 123;
  static readonly fakeChangedBetTypes: BetTypeAddRequest[] = [
    { id: 1, name: 'Test Bet Type', isChecked: true, isDisable: false }
  ];
  static readonly fakeAdvancedModeAddRequestModel = {
    checkedBetTypes: [],
    betTeamsResult: [],
    selectedAllBetTypes: []
  } as AdvancedModeAddRequestModel;
  static readonly fakeBetTeams = [
    {
      index: 0,
      name: 'Test Team',
      value: 'value',
      type: 1,
      betTypes: '1',
      isShow: true,
      selections: [],
      inputs: []
    }
  ] as BetTeamAddRequest[];
  static readonly fakeOddsInfo = [
    {
      betTypeId: 1,
      playerName: 'Test Player',
      playerId: 1,
      oddsId: '1',
      betChoice: 'choice',
      playNamesChineseTraditional: '',
      playNamesChineseSimplified: '',
      oddsInfo: '',
      performance: ''
    }
  ] as OddsInfo[];
}

describe('AdvancedModeComponent', () => {
  let component: AdvancedModeComponent;
  let fixture: ComponentFixture<AdvancedModeComponent>;
  let commonService: CommonService;

  beforeEach(async () => {
    const mockItemsSelectService = {
      getValueChildsChecked: jest.fn().mockReturnValue(''),
      countChildsChecked: jest.fn().mockReturnValue(0),
      getTextChildsChecked: jest.fn().mockReturnValue(''),
      checkChilds: jest.fn()
    };

    const mockMultipleSelectionService = {
      getValueItems: jest.fn().mockReturnValue(''),
      getValueCheckedItemsList: jest.fn().mockReturnValue([]),
      getDisplayedItems: jest.fn().mockReturnValue(''),
      checkAllItems: jest.fn(),
      updateItemChecked: jest.fn(),
      updateChildItemsChecked: jest.fn(),
      updateDisableStatus: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        CommonService,
        StaticService,
        { provide: ItemsSelectService, useValue: mockItemsSelectService },
        { provide: MultipleSelectionService, useValue: mockMultipleSelectionService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdvancedModeComponent);
    commonService = fixture.debugElement.injector.get(CommonService);
    component = fixture.componentInstance;
    component.changeFilterEvent.emit = jest.fn();
    component.isLoadingData.emit = jest.fn();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.betTeams).toEqual([]);
    expect(component.isCollapse).toBeTruthy();
    expect(component.isShowAdvancedModeFilter).toBeFalsy();
  });

  it('should handle ngOnChanges with matchId and changedBetTypes', async () => {
    // Arrange
    component.matchId = Helper.fakeMatchId;
    component.changedBetTypes = Helper.fakeChangedBetTypes;
    component.betTeams = [];
    const mockGetBetTeams = jest.fn().mockResolvedValue(Helper.fakeBetTeams);
    Object.defineProperty(component, 'service', {
      get: () => ({ getBetTeamsAddRequest: mockGetBetTeams })
    });
    commonService.getOddsInfoSpecialBetTypes = jest.fn().mockResolvedValue(Helper.fakeOddsInfo);

    // Act
    await component.ngOnChanges({
      changedBetTypes: {
        currentValue: Helper.fakeChangedBetTypes,
        previousValue: null,
        firstChange: true
      } as SimpleChange
    });

    // Assert
    expect(component.isLoadingData.emit).toHaveBeenCalledWith(true);
    expect(mockGetBetTeams).toHaveBeenCalled();
    expect(component.isLoadingData.emit).toHaveBeenCalledWith(false);
  });

  it('should handle ngOnChanges with advancedModeAddRequestModel', async () => {
    // Arrange
    component.matchId = Helper.fakeMatchId;
    component.advancedModeAddRequestModel = Helper.fakeAdvancedModeAddRequestModel;
    const mockGetBetTeams = jest.fn().mockResolvedValue(Helper.fakeBetTeams);
    Object.defineProperty(component, 'service', {
      get: () => ({ getBetTeamsAddRequest: mockGetBetTeams })
    });
    commonService.getOddsInfoSpecialBetTypes = jest.fn().mockResolvedValue(Helper.fakeOddsInfo);

    // Act
    await component.ngOnChanges({
      advancedModeAddRequestModel: {
        currentValue: Helper.fakeAdvancedModeAddRequestModel,
        previousValue: null,
        firstChange: true
      } as SimpleChange
    });

    // Assert
    expect(component.isLoadingData.emit).toHaveBeenCalledWith(true);
    expect(mockGetBetTeams).toHaveBeenCalled();
    expect(component.isLoadingData.emit).toHaveBeenCalledWith(false);
  });

  it('should expand and validate', () => {
    // Arrange
    component.isCollapse = true;

    // Act
    component.expandAndValidate();

    // Assert
    expect(component.isCollapse).toBeFalsy();
  });

  it('should clear bet team', () => {
    // Arrange
    component.isShowAdvancedModeFilter = true;
    component.isCollapse = false;
    component.betTeams = Helper.fakeBetTeams;

    // Act
    component.clearBetTeam();

    // Assert
    expect(component.isShowAdvancedModeFilter).toBeFalsy();
    expect(component.isCollapse).toBeTruthy();
    expect(component.betTeams).toEqual([]);
  });

  it('should validate selections', () => {
    // Arrange
    const betTeam = Helper.fakeBetTeams[0];

    betTeam.selections = [{
      index: 0,
      name: 'Test Selection',
      value: "value",
      items: [],
      multiSelection: null,
      isMultiple: false,
      xmlAttribute: 'test',
      isDisabled: false
    }];

    // Act
    const result = component.isValidSelections(betTeam);

    // Assert
    expect(result).toBeTruthy();
  });

  it('should emit changeFilterEvent when changeFilter is called', () => {
    // Arrange
    const emitSpy = jest.spyOn(component.changeFilterEvent, 'emit');

    // Act
    component.changeFilter();

    // Assert
    expect(emitSpy).toHaveBeenCalled();
  });

  it('should return true when onChangeInputMultipleDecimal is called with valid input', () => {
    // Arrange
    const betTeamIndex = 0;
    const inputIndex = 0;
    const isMultiple = false;
    const value = '123.45';
    component.betTeams = Helper.fakeBetTeams;

    // Act
    const result = component.onChangeInputMultipleDecimal(betTeamIndex, inputIndex, isMultiple, value);

    // Assert
    expect(result).toBeTruthy();
  });

  it('should return false when onChangeInputMultipleDecimal is called with invalid input', () => {
    // Arrange
    const betTeamIndex = 0;
    const inputIndex = 0;
    const isMultiple = false;
    const value = 'invalid';
    component.betTeams = Helper.fakeBetTeams;
    
    // Mock the tooltip element to prevent undefined error
    component.tooltip.element = {
      nativeElement: {
        getElementsByClassName: jest.fn().mockReturnValue([{
          scrollIntoView: jest.fn(),
          getBoundingClientRect: jest.fn().mockReturnValue({
            top: 0,
            left: 0,
            height: 0
          })
        }]),
        closest: jest.fn().mockReturnValue(null)
      }
    } as any;

    // Act
    const result = component.onChangeInputMultipleDecimal(betTeamIndex, inputIndex, isMultiple, value);

    // Assert
    expect(result).toBeFalsy();
  });

  it('should return checked bet type models', () => {
    // Arrange
    component.betTeams = Helper.fakeBetTeams;
    component.betTeams[0].isShow = true;

    // Act
    const result = component.getCheckedBetTypeModels();

    // Assert
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBeTruthy();
  });

  it('should return validity status', () => {
    // Arrange
    component.betTeams = Helper.fakeBetTeams;
    component.betTeams[0].isShow = true;
    component.betTeams[0].selections = [{
      index: 0,
      name: 'Test Selection',
      value: 'test',
      items: [],
      multiSelection: null,
      isMultiple: false,
      xmlAttribute: 'test',
      isDisabled: false
    }];
    component.betTeams[0].inputs = [{
      index: 0,
      name: 'Test Input',
      value: '123.45',
      isMultiple: false,
      isDisabled: false,
      xmlAttribute: 'test',
      isRowSpan: false,
      isChecked: false,
      format: ''
    }];

    // Act
    const result = component.isValidity();

    // Assert
    expect(typeof result).toBe('boolean');
  });

  it('should handle changeByControlAllBetType', () => {
    // Arrange
    const event = { itemList: ['item1', 'item2'], type: 'TestType' };
    component.betTeams = Helper.fakeBetTeams;
    component.betTeams[0].selections = [{
      index: 0,
      name: 'TestType',
      value: '',
      items: [],
      multiSelection: {
        name: 'Test',
        value: '',
        xmlAttribute: 'test',
        multipleSelect: new MultipleSelection()
      },
      isMultiple: true,
      xmlAttribute: 'test',
      isDisabled: false
    }] as Selection[];

    // Act
    component.changeByControlAllBetType(event);

    // Assert
    expect(component.betTeams).toBeDefined();
  });

  it('should get all bet types selection', () => {
    // Arrange
    component.controlsAllBetTypesLists = [{
      type: 'TestType',
      isShow: true,
      items: new MultipleSelection()
    }];

    // Act
    const result = component.getAllBetTypesSelection();

    // Assert
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBeTruthy();
  });

  it('should reset controls all bet types', () => {
    // Arrange
    component.controlsAllBetTypesLists = [{
      type: 'TestType',
      isShow: true,
      items: new MultipleSelection()
    }];

    // Act
    component.resetControlsAllBetTypes();

    // Assert
    expect(component.controlsAllBetTypesLists).toBeDefined();
  });

  it('should update other selection for Performance', () => {
    // Arrange
    const betTeam = Helper.fakeBetTeams[0];
    const performanceMultipleSelection = new MultipleSelection();
    const othersMultipleSelection = new MultipleSelection();
    
    const performanceSelection = {
      index: 0,
      name: 'Performance',
      value: '',
      items: [],
      multiSelection: {
        name: 'Performance',
        value: '',
        xmlAttribute: 'test',
        multipleSelect: performanceMultipleSelection
      },
      isMultiple: true,
      xmlAttribute: 'test',
      isDisabled: false
    };
    
    const othersSelection = {
      index: 1,
      name: 'Others',
      value: '',
      items: [],
      multiSelection: {
        name: 'Others',
        value: '',
        xmlAttribute: 'test',
        multipleSelect: othersMultipleSelection
      },
      isMultiple: true,
      xmlAttribute: 'test',
      isDisabled: false
    };
    
    betTeam.selections = [performanceSelection, othersSelection];
    component.betTeams = [betTeam];
    component.oddsInfo = Helper.fakeOddsInfo;

    // Act
    component.updateOtherSelection(betTeam, performanceSelection);

    // Assert
    expect(betTeam.selections).toBeDefined();
  });

  it('should validate inputs correctly', () => {
    // Arrange
    const betTeam = Helper.fakeBetTeams[0];
    betTeam.inputs = [{
      index: 0,
      name: 'Test Input',
      value: '123.45',
      isMultiple: false,
      isDisabled: false,
      xmlAttribute: 'test',
      isRowSpan: false,
      isChecked: false,
      format: ''
    }];

    // Act - Test through public method
    const result = component.isValidity();

    // Assert
    expect(typeof result).toBe('boolean');
  });

  it('should handle ngOnChanges when matchId is not provided', async () => {
    // Arrange
    component.matchId = null;
    component.changedBetTypes = Helper.fakeChangedBetTypes;

    // Act
    await component.ngOnChanges({
      changedBetTypes: {
        currentValue: Helper.fakeChangedBetTypes,
        previousValue: null,
        firstChange: true
      } as SimpleChange
    });

    // Assert
    expect(component.betTeams).toEqual([]);
  });

  it('should handle ngOnChanges when changedBetTypes is empty', async () => {
    // Arrange
    component.matchId = Helper.fakeMatchId;
    component.changedBetTypes = [];

    // Act
    await component.ngOnChanges({
      changedBetTypes: {
        currentValue: [],
        previousValue: null,
        firstChange: true
      } as SimpleChange
    });

    // Assert
    expect(component.betTeams).toEqual([]);
  });

  it('should handle expandAndValidate when already expanded', () => {
    // Arrange
    component.isCollapse = false;

    // Act
    component.expandAndValidate();

    // Assert
    expect(component.isCollapse).toBeTruthy();
  });

  it('should handle getCheckedBetTypeModels when no bet teams are shown', () => {
    // Arrange
    component.betTeams = Helper.fakeBetTeams;
    component.betTeams[0].isShow = false;

    // Act
    const result = component.getCheckedBetTypeModels();

    // Assert
    expect(result).toEqual([]);
  });

  it('should handle getAllBetTypesSelection when no controls are shown', () => {
    // Arrange
    component.controlsAllBetTypesLists = [{
      type: 'TestType',
      isShow: false,
      items: new MultipleSelection()
    }] as ControlsAllBetTypes[];

    // Act
    const result = component.getAllBetTypesSelection();

    // Assert
    expect(result).toEqual([]);
  });

  it('should handle updateOtherSelection for non-Performance selection', () => {
    // Arrange
    const betTeam = Helper.fakeBetTeams[0];
    const selection = {
      index: 0,
      name: 'Other Selection',
      value: '',
      items: [],
      multiSelection: null,
      isMultiple: false,
      xmlAttribute: 'test',
      isDisabled: false
    };
    betTeam.selections = [selection];
    component.betTeams = [betTeam];

    // Act
    component.updateOtherSelection(betTeam, selection);

    // Assert
    expect(betTeam.selections).toBeDefined();
  });

}); 