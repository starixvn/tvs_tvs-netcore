import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OddsInfo } from '../../../../../../utility/components/advanced-mode/advanced-mode/advanced-mode.model';
import { TestingModule } from '../../../../../../utility/modules/testing.module';
import { FilterReducedOverItemComponent } from '../filter-reduced-over-item/filter-reduced-over-item.component';
import { ReducedOverBetType } from '../models/bet-type-reduced-over-json.model';
import { FilterReducedOverModel } from '../models/filter-reduced-over.model';
import { FilterReducedOverService } from '../services/filter-reduced-over.service';
import { FilterReducedOverComponent } from './filter-reduced-over.component';

class Helper {
  static readonly fakeFilterModel: FilterReducedOverModel = {
    betTypeIds: ['1'],
    betTypeName: 'Test Bet Type',
    isChecked: true,
    isValid: true,
    wicketOver: '',
    playerIds: [],
    runs: '',
    over: '',
    wicket: '',
    player: '',
    run: '',
    live: false,
    nonLive: false,
    betTypeNgSelectMixtureModel: null,
    playerMultipleSelection: false
  } as unknown as FilterReducedOverModel;

  static readonly fakeReducedOverBetType: ReducedOverBetType = {
    betTypeId: 1,
    betTypeName: 'Test Bet Type',
    isChecked: true,
    isHasOverWicket: true,
    isHasPlayer: true,
    isHasRuns: true,
    parentId: 1,
    items: []
  } as ReducedOverBetType;

  static readonly fakeOddsInfo: OddsInfo = {
    playerId: '1',
    playerName: 'Test Player',
    odds: 1.5,
    betTypeId: 1,
    oddsId: 1,
    betChoice: '1',
    playNamesChineseTraditional: '',
    playNamesChineseSimplified: ''
  } as unknown as OddsInfo;
}

describe('FilterReducedOverComponent', () => {
  let component: FilterReducedOverComponent;
  let fixture: ComponentFixture<FilterReducedOverComponent>;
  let filterService: FilterReducedOverService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        FilterReducedOverService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FilterReducedOverComponent);
    filterService = fixture.debugElement.injector.get(FilterReducedOverService);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit change filter event', () => {
    // Arrange
    component.changeFilterEvent = { emit: jest.fn() } as any;

    // Act
    component.changeFilter();

    // Assert
    expect(component.changeFilterEvent.emit).toHaveBeenCalled();
  });

  it('should validate all filter items', () => {
    // Arrange
    const mockFilterItem1 = { isValid: () => true } as FilterReducedOverItemComponent;
    const mockFilterItem2 = { isValid: () => true } as FilterReducedOverItemComponent;
    component.filterItemComponents = {
      toArray: () => [mockFilterItem1, mockFilterItem2]
    } as any;

    // Act
    const result = component.isValid();

    // Assert
    expect(result).toBeTruthy();
  });

  it('should return false when any filter item is invalid', () => {
    // Arrange
    const mockFilterItem1 = { isValid: () => true } as FilterReducedOverItemComponent;
    const mockFilterItem2 = { isValid: () => false } as FilterReducedOverItemComponent;
    component.filterItemComponents = {
      toArray: () => [mockFilterItem1, mockFilterItem2]
    } as any;

    // Act
    const result = component.isValid();

    // Assert
    expect(result).toBeFalsy();
  });

  it('should add new bet type item', () => {
    // Arrange
    component.models = [];
    component.groupReducedOverBetTypes = [Helper.fakeReducedOverBetType];
    filterService.initDefaultFilter = jest.fn().mockReturnValue(Helper.fakeFilterModel);

    // Act
    component.addBetTypeItem();

    // Assert
    expect(filterService.initDefaultFilter).toHaveBeenCalledWith([Helper.fakeReducedOverBetType]);
    expect(component.models.length).toBe(1);
    expect(component.models[0]).toEqual(Helper.fakeFilterModel);
  });

  it('should remove bet type item at specified index', () => {
    // Arrange
    const secondModel = { ...Helper.fakeFilterModel, betTypeIds: ['2'] };
    component.models = [
      Helper.fakeFilterModel,
      secondModel
    ];

    // Act
    component.removeBetTypeItem(0);

    // Assert
    expect(component.models.length).toBe(1);
    expect(component.models[0]).toEqual(secondModel);
  });
});
