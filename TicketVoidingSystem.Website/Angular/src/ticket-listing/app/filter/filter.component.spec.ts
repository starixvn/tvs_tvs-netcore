import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FilterComponent } from './filter.component';
import { AppService } from '../app.service';
import { CommonService } from '../../../utility/services/common.service';
import { BlockUiService } from '../../../utility/components/block-ui/block-ui.service';
import { ElementRef, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { AdvancedModeComponent } from '../../../utility/components/advanced-mode/advanced-mode/advanced-mode.component';
import { GroupBetTypesComponent } from '../../../utility/components/advanced-mode/group-bettypes/group-bettypes.component';
import { BetTypesComponent } from '../../../utility/components/bettypes/bettypes.component';
import { BetTypesVirtualSportComponent } from '../../../utility/components/bettypes-virtualsports/bettypes-virtualsports.component';
import { DateFullTimeNewComponent } from '../../../utility/components/date-time/date-full-time-new/date-full-time-new.component';
import { TooltipComponent } from '../../../utility/components/tooltip/tooltip.component';
import { Product } from '../../../utility/constants/config';
import { GroupBetTypesModel } from '../../../utility/components/advanced-mode/group-bettypes/group-bettypes.model';
import { BetTypesModel } from '../../../utility/components/bettypes/bettypes.model';
import { Selection } from '../../../utility/models/selection.model';
import { MatchModel } from '../../../utility/models/match.model';
import { FilterEvent } from './filter.model';
import { Tooltip } from '../../../utility/components/tooltip/tooltip.model';

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
  let appService: AppService;
  let commonService: CommonService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        NgSelectModule,
        AdvancedModeComponent,
        GroupBetTypesComponent,
        BetTypesComponent,
        BetTypesVirtualSportComponent,
        DateFullTimeNewComponent,
        TooltipComponent
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
        { provide: ElementRef, useValue: { nativeElement: document.createElement('div') }}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FilterComponent);
    component = fixture.componentInstance;
    
    appService = fixture.debugElement.injector.get(AppService);
    commonService = fixture.debugElement.injector.get(CommonService);

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
    expect(appService.getLicensees).toHaveBeenCalled();
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
      getValueCheckedBetTypes: jest.fn().mockReturnValue('1')
    } as unknown as GroupBetTypesModel;
    component.ballSequences = {
      value: [],
      name: '',
      items: [],
      isChecked: false,
      changeAll: jest.fn(),
      changeItem: jest.fn()
    };
    component.disabledTransDate = true;
    component.singleOrSubParlay = 'All';
    component.checkMatch = '';
    component.searchEvent = new EventEmitter<FilterEvent>();

    jest.spyOn(component, 'validateProduct').mockReturnValue(true);
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
      hide: jest.fn()
    } as any;

    // Act
    component.search();

    // Assert
    expect(component.searchEvent.emit).not.toHaveBeenCalled();
    expect(component.tooltip.display).toHaveBeenCalled();
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

  it('#getSelectionSubParlays should return empty string when not SubParlay', () => {
    // Arrange
    component.singleOrSubParlay = 'All';

    // Act
    const result = component.getSelectionSubParlays('All');

    // Assert
    expect(result).toBe('');
  });

  it('#getSelectionSubParlays should return selected items when SubParlay', () => {
    // Arrange
    component.singleOrSubParlay = 'SubParlay';
    component.selectedComboParlay = ['1', '2'];

    // Act
    const result = component.getSelectionSubParlays('SubParlay');

    // Assert
    expect(result).toBe('1,2');
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

  it('#checkFilterParams should validate match ID', () => {
    // Arrange
    component.matchId = '';
    component.tooltip = {
      display: jest.fn()
    } as unknown as Tooltip;

    // Act
    const result = component.checkFilterParams();

    // Assert
    expect(result).toBe(false);
    expect(component.tooltip.display).toHaveBeenCalledWith('match-id', expect.any(String));
  });

  it('#isShowAdvancedMode should return true for SPORTS_BOOK', () => {
    // Arrange
    component.query.product = Product.SPORTS_BOOK;

    // Act
    const result = component.isShowAdvancedMode();

    // Assert
    expect(result).toBe(true);
  });
});
