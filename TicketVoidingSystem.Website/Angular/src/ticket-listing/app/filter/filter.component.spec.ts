import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FilterComponent } from './filter.component';
import { AppService } from '../app.service';
import { CommonService } from '../../../utility/services/common.service';
import { BlockUiService } from '../../../utility/components/block-ui/block-ui.service';
import { ElementRef, EventEmitter } from '@angular/core';
import { AdvancedModeComponent } from '../../../utility/components/advanced-mode/advanced-mode/advanced-mode.component';
import { GroupBetTypesComponent } from '../../../utility/components/advanced-mode/group-bettypes/group-bettypes.component';
import { Product } from '../../../utility/constants/config';
import { GroupBetTypesModel } from '../../../utility/components/advanced-mode/group-bettypes/group-bettypes.model';
import { BetTypesModel } from '../../../utility/components/bettypes/bettypes.model';
import { Selection } from '../../../utility/models/selection.model';
import { MatchModel } from '../../../utility/models/match.model';
import { FilterEvent } from './filter.model';
import { Tooltip } from '../../../utility/components/tooltip/tooltip.model';
import { TestingModule } from '../../../utility/modules/testing.module';
import { AppComponent } from '../app.component';
import { FilterService } from './filter.service';
import { StaticService } from '../../../utility/services/static.service';

class Helper {
  static readonly mockLicensees = [
    { id: 1, name: 'Licensee 1' },
    { id: 2, name: 'Licensee 2' }
  ];

  static readonly mockBetTypes = {
    betTypes: [{ id: '1', name: 'Test Bet Type', liveIndicator: false, type: 1, isChecked: false }],
    isChecked: false,
    result: {
      errorCode: 0,
      errorMsg: '',
      isSuccessful: true,
      data: null
    }
  } as BetTypesModel;

  static readonly mockGroupBetTypes = {
    groupBetTypes: [{
      groupName: 'Test Group',
      betTypes: [{
        id: 1,
        name: 'Test Bet Type',
        liveIndicator: false,
        type: 1,
        value: '1',
        isChecked: false,
        redHighlight: false,
        blueHighlight: false
      }],
      isChecked: false,
      isShow: true,
      changeCheckedGroupToBetType: () => {},
      changeCheckedBetTypeToGroup: () => {},
      getCheckedBetTypes: () => [1],
      getValueCheckedBetTypes: () => ['1'],
      hasBetType: () => true
    }],
    isChecked: false,
    result: {
      errorCode: 0,
      errorMsg: '',
      isSuccessful: true,
      data: null
    },
    changeCheckedModelToGroup: () => {},
    changeCheckedGroupToModel: () => {},
    getCheckedBetTypes: () => [1],
    getValueCheckedBetTypes: () => '1',
    getAllBetType: () => [{
      id: 1,
      name: 'Test Bet Type',
      liveIndicator: false,
      type: 1,
      value: '1',
      isChecked: false,
      redHighlight: false,
      blueHighlight: false
    }],
    hasBetType: () => true
  } as unknown as GroupBetTypesModel;

  static readonly mockMatch = {
    matchCode: 'TEST123',
    matchEvent: 'Test Event',
    eventDate: new Date('2024-03-20'),
    globalShowTime: new Date('2024-03-20T10:00:00'),
    startTime: new Date('2024-03-20T10:00:00'),
    endTime: new Date('2024-03-20T11:00:00'),
    matchId: 123,
    leagueName: 'Test League',
    sportType: 1
  } as MatchModel;

  static readonly mockFilterEvent = {
    match: this.mockMatch,
    query: {
      matchId: 123,
      product: Product.SPORTS_BOOK,
      groupBy: 0,
      isReSettled: false,
      licenseeId: 1,
      betTypes: '1',
      selectionType: '',
      ballSequence: '',
      ticketType: 0,
      eventType: 0,
      liveHomeScore: 0,
      liveAwayScore: 0,
      fromTransDate: '',
      toTransDate: '',
      singleOrSubParlay: '',
      selectionSubParlays: ''
    }
  } as FilterEvent;
}

describe('FilterComponent', () => {
  let component: FilterComponent;
  let fixture: ComponentFixture<FilterComponent>;
  let commonService: CommonService;
  let filterService: FilterService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TestingModule
      ],
      providers: [
        { provide: AppService, useValue: { 
          getLicensees: jest.fn().mockResolvedValue(Helper.mockLicensees),
          getMatchInfo: jest.fn().mockResolvedValue(Helper.mockMatch),
          getSelectionTypes: jest.fn().mockResolvedValue([])
        }},
        { provide: CommonService, useValue: {
          getBetTypes: jest.fn().mockResolvedValue(Helper.mockBetTypes),
          getGroupBetTypes: jest.fn().mockResolvedValue(Helper.mockGroupBetTypes),
          getBetTypesVirtualSports: jest.fn().mockResolvedValue(Helper.mockGroupBetTypes)
        }},
        { provide: BlockUiService, useValue: { start: jest.fn(), stop: jest.fn() }},
        { provide: ElementRef, useValue: { nativeElement: document.createElement('div') }},
        { provide: AppComponent, useValue: {}},
        { provide: FilterService, useValue: {
          getLicenseeSelectList: jest.fn().mockResolvedValue([
            { id: 0, name: 'All' },
            { id: -1, name: 'Credit' },
            ...Helper.mockLicensees.map(l => ({ id: l.id, name: l.name, group: 'Licensee' }))
          ]),
          invalidProduct: jest.fn().mockReturnValue(false),
          invalidMatch: jest.fn().mockReturnValue(false),
          isSportsBookOrHybridParlay: jest.fn((product: number) => product === Product.SPORTS_BOOK || product === Product.HYBRID_PARLAY),
          isBetBuilder: jest.fn((product: number) => product === Product.BET_BUILDER),
          isSelectionNotValid: jest.fn().mockReturnValue(false),
          getSelectionSubParlays: jest.fn().mockReturnValue(''),
          isShowCheckboxAffected: jest.fn().mockReturnValue(false),
          enableBetTypesAndAdvancedMode: jest.fn(),
          checkAndDisabledAllBetTypes: jest.fn(),
          checkAndDisabledAllGroupBetTypes: jest.fn()
        }}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FilterComponent);
    component = fixture.componentInstance;
    commonService = TestBed.inject(CommonService);
    filterService = TestBed.inject(FilterService);

    // Mock StaticService methods
    jest.spyOn(StaticService, 'isNumber').mockReturnValue(true);
    jest.spyOn(StaticService, 'isFromTimeSameOrBeforeToTime').mockReturnValue(true);
    
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Initialize searchEvent
    component.searchEvent = new EventEmitter<FilterEvent>();

    fixture.detectChanges();
  });

  it('should create', () => {
    // Arrange & Act & Assert
    expect(component).toBeTruthy();
  });

  it('#ngOnInit should initialize filter', async () => {
    // Arrange & Act
    await component.ngOnInit();

    // Assert
    expect(filterService.getLicenseeSelectList).toHaveBeenCalled();
    expect(component.licenseeSelectList.length).toBeGreaterThan(0);
    expect(component.query.groupBy).toBe(0);
    expect(component.query.ticketType).toBe(0);
    expect(component.query.product).toBe(0);
    expect(component.query.eventType).toBe(2);
  });

  it('#search should emit search event when validation passes', async () => {
    // Arrange
    component.matchId = '123';
    component.match = Helper.mockMatch;
    component.query.product = Product.SPORTS_BOOK;
    component.tooltip = {
      display: jest.fn()
    } as unknown as Tooltip;
    component.groupBetTypesComponent = {
      validate: jest.fn().mockReturnValue(true)
    } as unknown as GroupBetTypesComponent;
    component.advancedModeComponent = {
      validate: jest.fn().mockReturnValue(true),
      getBetTypeModels: jest.fn().mockReturnValue([])
    } as unknown as AdvancedModeComponent;
    component.groupBetTypes = {
      groupBetTypes: [{
        groupName: 'Test Group',
        betTypes: [{
          id: 1,
          name: 'Test Bet Type',
          liveIndicator: false,
          type: 1,
          value: '1',
          isChecked: false,
          redHighlight: false,
          blueHighlight: false
        }],
        isChecked: false,
        isShow: true
      }],
      isChecked: false,
      getValueCheckedBetTypes: jest.fn().mockReturnValue('1')
    } as unknown as GroupBetTypesModel;
    
    // Mock the groupBetTypesService.getValueCheckedBetTypes method
    jest.spyOn(component['groupBetTypesService'], 'getValueCheckedBetTypes').mockReturnValue('1');
    component.ballSequences = {
      value: [],
      name: 'All',
      items: [],
      isChecked: false
    };
    component.disabledTransDate = true;
    component.singleOrSubParlay = 'All';
    component.checkMatch = '';
    component.searchEvent = new EventEmitter<FilterEvent>();
    component.appComponent.logAccessAction = jest.fn();
    component['validateProduct'] = jest.fn().mockReturnValue(true);
    jest.spyOn(component, 'validateBetTypes').mockReturnValue(true);

    const searchEventSpy = jest.spyOn(component.searchEvent, 'emit');

    // Act
    component.search();

    // Assert
    expect(searchEventSpy).toHaveBeenCalled();
    const emitArg = searchEventSpy.mock.calls[0][0];
    expect(emitArg.match).toBe(Helper.mockMatch);
    expect(emitArg.query.matchId).toBe(123);
    expect(emitArg.query.product).toBe(Product.SPORTS_BOOK);
    expect(emitArg.query.betTypes).toBe('1');
    expect(emitArg.query.ballSequence).toBe('');
  });

  it('#search should not emit search event when matchId is empty', () => {
    // Arrange
    component.matchId = '';
    jest.spyOn(component.searchEvent, 'emit');
    
    // Mock tooltip
    component.tooltip = {
      display: jest.fn(),
      hide: jest.fn(),
      element: { nativeElement: { scrollIntoView: jest.fn() } }
    } as any;
    component.betTypesComponent = {
      validate: jest.fn().mockReturnValue(true)
    } as any;
    component.betTypes = {
      betTypes: []
    } as any;
    // Mock invalidMatch to actually call tooltip.display like the real implementation
    filterService.invalidMatch = jest.fn((matchId: string, match: any, tooltip: any) => {
      if (matchId === '' || matchId === undefined) {
        tooltip.display('match-id', 'Required Match ID');
        return true;
      }
      return false;
    });

    // Act
    component.search();

    // Assert
    expect(component.searchEvent.emit).not.toHaveBeenCalled();
    expect(filterService.invalidMatch).toHaveBeenCalledWith('', component.match, component.tooltip);
    expect(component.tooltip.display).toHaveBeenCalledWith('match-id', expect.any(String));
  });

  it('#changeProduct should handle product change correctly', async () => {
    // Arrange
    const newProduct = Product.SPORTS_BOOK;
    component.query.product = 0;
    component.changeMatchEvent.emit = jest.fn();
    component.sportType = 98;

    // Act
    await component.changeProduct(newProduct);

    // Assert
    expect(component.query.product).toBe(newProduct);
    expect(component.disabledTransDate).toBe(true);
    expect(component.singleOrSubParlay).toBe('All');
  });

  it('#getBetTypes should fetch bet types', async () => {
    // Arrange
    const query = { mode: 3, matchId: 0 };

    // Act
    await component.getBetTypes();

    // Assert
    expect(commonService.getBetTypes).toHaveBeenCalledWith(query);
    expect(component.commonBetTypes).toBeInstanceOf(BetTypesModel);
  });

  it('#blurMatchId should get match info when matchId changes', async () => {
    // Arrange
    component.matchId = '123';
    component.preMatchId = '456';
    jest.spyOn(component, 'getMatchInfo');

    // Act
    await component.blurMatchId();

    // Assert
    expect(component.getMatchInfo).toHaveBeenCalled();
  });

  it('#resetCheckedComboParlay should reset combo parlay selections', () => {
    // Arrange
    component.comboParlay = [{ name: 'test', value: '1' } as Selection];

    // Act
    component.resetCheckedComboParlay();

    // Assert
    expect(component.selectedComboParlay).toContain('1');
  });

  it('#getParams should call filterService.getSelectionSubParlays', () => {
    // Arrange
    component.singleOrSubParlay = 'SubParlay';
    component.selectedComboParlay = ['1'];
    component.matchId = '123';
    component.match = Helper.mockMatch;
    component.ballSequences = { value: [] } as any;
    component.disabledTransDate = true;
    component.isReSettled = false;
    component.query.product = Product.SPORTS_BOOK;
    component.groupBetTypes = {
      groupBetTypes: [{
        groupName: 'Test Group',
        betTypes: [{
          id: 1,
          name: 'Test Bet Type',
          liveIndicator: false,
          type: 1,
          value: '1',
          isChecked: false,
          redHighlight: false,
          blueHighlight: false
        }],
        isChecked: false,
        isShow: true
      }],
      isChecked: false,
      getValueCheckedBetTypes: jest.fn().mockReturnValue('1')
    } as any;
    component.advancedModeComponent = {
      getBetTypeModels: jest.fn().mockReturnValue([])
    } as unknown as AdvancedModeComponent;
    jest.spyOn(component['groupBetTypesService'], 'getValueCheckedBetTypes').mockReturnValue('1');
    filterService.getSelectionSubParlays = jest.fn((bet: string, selectedComboParlay: string[]) => {
      return bet !== "SubParlay" ? "" : selectedComboParlay.join(',');
    });
    // Act
    const result = component.getParams();

    // Assert
    expect(result.matchId).toBe(123);
    expect(result.selectionSubParlays).toBe('1');
    expect(filterService.getSelectionSubParlays).toHaveBeenCalledWith('SubParlay', ['1']);
  });

  it('#validateBetTypes should validate bet types for SPORTS_BOOK', () => {
    // Arrange
    component.query.product = Product.SPORTS_BOOK;
    component.checkMatch = '';
    component.groupBetTypesComponent = {
      validate: jest.fn().mockReturnValue(true)
    } as unknown as GroupBetTypesComponent;

    // Act
    const result = component.validateBetTypes();

    // Assert
    expect(result).toBe(true);
    expect(component.groupBetTypesComponent.validate).toHaveBeenCalled();
  });

  it('#checkFilterParams should validate match ID using filterService', () => {
    // Arrange
    component.matchId = '123'; // Set valid matchId to reach isSelectionNotValid check
    component.match = Helper.mockMatch; // Set valid match
    component.tooltip = new Tooltip();
    component.tooltip.display = jest.fn();
    component.tooltip.element = { nativeElement: { scrollIntoView: jest.fn() } } as any;
    component.singleOrSubParlay = 'SubParlay'; // Set to SubParlay to trigger isSelectionNotValid
    component.selectedComboParlay = []; // Empty to make it invalid
    component.disabledTransDate = true;
    component.fromDate = '2024-01-01 10:00:00';
    component.toDate = '2024-01-02 11:00:00';
    component.query.product = Product.BET_BUILDER; // Set to non-SPORTS_BOOK to avoid advanced mode
    component.advancedModeComponent = {
      validate: jest.fn().mockReturnValue(true),
      getBetTypeModels: jest.fn().mockReturnValue([])
    } as unknown as AdvancedModeComponent;
    filterService.isSelectionNotValid = jest.fn().mockReturnValue(true);
    
    // Act
    const result = component.checkFilterParams();

    // Assert
    expect(result).toBe(false);
    expect(component.tooltip.display).toHaveBeenCalledWith('selection-dropdown-sub-parlay', expect.any(String));
  });

  it('#isShowAdvancedMode should return true for SPORTS_BOOK', () => {
    // Arrange
    component.query.product = Product.SPORTS_BOOK;

    // Act
    const result = component.isShowAdvancedMode();

    // Assert
    expect(result).toBe(true);
  });

  it('#validateProduct should call filterService.invalidProduct', () => {
    // Arrange
    filterService.invalidProduct = jest.fn().mockReturnValue(true);
    component.tooltip = new Tooltip();
    component.tooltip.display = jest.fn();
    component.tooltip.element = { nativeElement: { scrollIntoView: jest.fn() } } as any;

    // Act
    const result = component['validateProduct']();

    // Assert
    expect(result).toBe(false);
    expect(filterService.invalidProduct).toHaveBeenCalled();
  });

  it('#validateProduct should return false when product is invalid', () => {
    // Arrange
    component.query.product = 0; // Set to invalid product
    component.sportType = 100; // Set to invalid sport type
    component.tooltip = new Tooltip();
    component.tooltip.display = jest.fn();
    component.tooltip.element = { nativeElement: { scrollIntoView: jest.fn() } } as any;
    filterService.invalidProduct = jest.fn().mockReturnValue(true);
    
    // Act
    const result = component['validateProduct']();

    // Assert
    expect(result).toBe(false);
    expect(component.tooltip.display).toHaveBeenCalledWith('match-id', expect.any(String));
  });

  it('#checkFilterParams should call filterService.isNumber', () => {
    // Arrange
    component.matchId = '123';
    component.match = Helper.mockMatch;
    component.tooltip = {
      display: jest.fn()
    } as unknown as Tooltip;
    component.singleOrSubParlay = 'All';
    component.selectedComboParlay = [];
    component.disabledTransDate = true;
    component.fromDate = '2024-01-01';
    component.toDate = '2024-01-02';
    component.advancedModeComponent = {
      validate: jest.fn().mockReturnValue(true),
      getBetTypeModels: jest.fn().mockReturnValue([])
    } as unknown as AdvancedModeComponent;
    component.query.product = Product.SPORTS_BOOK;

    // Act
    const result = component.checkFilterParams();

    // Assert
    expect(result).toBe(true);
  });

  it('#unCheckAffectedTickets should reset isReSettled and call handleBetTypesAndAdvancedMode', () => {
    // Arrange
    component.handleBetTypesAndAdvancedMode = jest.fn();

    // Act
    component.unCheckAffectedTickets();

    // Assert
    expect(component.isReSettled).toBe(false);
    expect(component.handleBetTypesAndAdvancedMode).toHaveBeenCalled();
  });

  it('#handleBetTypesAndAdvancedMode should execute without errors', () => {
    // Arrange
    component.query.product = Product.SPORTS_BOOK;
    component.isReSettled = false;
    component.betTypesComponent = {
      isDisabledAllBetTypes: false
    } as any;
    component.groupBetTypesComponent = {
      isDisabledAllBetTypes: false
    } as any;
    component.betTypes = {
      isChecked: false,
      betTypes: [{ isChecked: false }]
    } as any;
    component.groupBetTypes = {
      isChecked: false,
      groupBetTypes: [{
        isChecked: false,
        betTypes: [{ isChecked: false }]
      }]
    } as any;

    // Act & Assert - should not throw
    expect(() => component.handleBetTypesAndAdvancedMode()).not.toThrow();
  });
});
