import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OddsInfo } from '../../../../../../utility/components/advanced-mode/advanced-mode/advanced-mode.model';
import { MultipleSelection } from '../../../../../../utility/components/multiple-selection/multiple-selection';
import { TestingModule } from '../../../../../../utility/modules/testing.module';
import { ReducedOverBetType } from '../models/bet-type-reduced-over-json.model';
import { FilterReducedOverModel } from '../models/filter-reduced-over.model';
import { FilterReducedOverService } from '../services/filter-reduced-over.service';
import { ValidationService } from '../services/validation.service';
import { FilterReducedOverItemComponent } from './filter-reduced-over-item.component';

class Helper {
  static readonly fakeFilterModel = {
    betTypeIds: [],
    wicketOver: null,
    runs: null,
    playerIds: [],
    live: false,
    nonLive: false,
    playerMultipleSelection: new MultipleSelection()
  } as FilterReducedOverModel;

  static readonly fakeReducedOverBetTypes = [
    {
      betTypeId: 1,
      betTypeName: 'Test Bet Type 1',
      parentId: 0,
      items: [],
      isHasOverWicket: true,
      isHasRuns: true,
      isHasPlayer: true
    },
    {
      betTypeId: 2,
      betTypeName: 'Test Bet Type 2',
      parentId: 0,
      items: [],
      isHasOverWicket: false,
      isHasRuns: true,
      isHasPlayer: false
    }
  ] as unknown as ReducedOverBetType[];

  static readonly fakePlayers = [
    {
      betTypeId: 1,
      playerId: 1,
      playerName: 'Player 1'
    },
    {
      betTypeId: 1,
      playerId: 2,
      playerName: 'Player 2'
    }
  ] as unknown as OddsInfo[];
}

describe('FilterReducedOverItemComponent', () => {
  let component: FilterReducedOverItemComponent;
  let fixture: ComponentFixture<FilterReducedOverItemComponent>;
  let validationService: ValidationService;
  let filterService: FilterReducedOverService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        ValidationService,
        FilterReducedOverService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FilterReducedOverItemComponent);
    validationService = fixture.debugElement.injector.get(ValidationService);
    filterService = fixture.debugElement.injector.get(FilterReducedOverService);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values when not voided', () => {
    // Arrange
    component.isVoided = false;
    component.model = Helper.fakeFilterModel;
    component.originalReducedOverBetTypes = Helper.fakeReducedOverBetTypes;
    component.originalPlayers = Helper.fakePlayers;

    // Act
    component.ngOnInit();

    // Assert
    expect(component.primitivePropertyItem.isDisabledWicketOver).toBeTruthy();
    expect(component.primitivePropertyItem.isDisabledPlayer).toBeTruthy();
    expect(component.primitivePropertyItem.isDisabledRuns).toBeTruthy();
    expect(component.primitivePropertyItem.isDisabledLive).toBeTruthy();
    expect(component.primitivePropertyItem.isDisabledNonLive).toBeTruthy();
  });

  it('should initialize with disabled controls when voided', () => {
    // Arrange
    component.isVoided = true;
    component.model = Helper.fakeFilterModel;
    component.originalReducedOverBetTypes = Helper.fakeReducedOverBetTypes;
    component.originalPlayers = Helper.fakePlayers;

    // Act
    component.ngOnInit();

    // Assert
    expect(component.primitivePropertyItem.isDisabledWicketOver).toBeTruthy();
    expect(component.primitivePropertyItem.isDisabledPlayer).toBeTruthy();
    expect(component.primitivePropertyItem.isDisabledRuns).toBeTruthy();
    expect(component.primitivePropertyItem.isDisabledLive).toBeTruthy();
    expect(component.primitivePropertyItem.isDisabledNonLive).toBeTruthy();
  });

  it('should update checked bet types and reset values when bet types change', () => {
    // Arrange
    component.model = Helper.fakeFilterModel;
    component.originalReducedOverBetTypes = Helper.fakeReducedOverBetTypes;
    component.originalPlayers = Helper.fakePlayers;
    const newBetTypeIds = ['1'];

    // Act
    component.updateCheckedBetTypes(newBetTypeIds);

    // Assert
    expect(component.model.betTypeIds).toEqual(newBetTypeIds);
    expect(component.model.wicketOver).toBeNull();
    expect(component.model.runs).toBeNull();
    expect(component.model.playerIds).toEqual([]);
    expect(component.model.live).toBeFalsy();
    expect(component.model.nonLive).toBeFalsy();
  });

  it('should render players when bet type has players', () => {
    // Arrange
    component.model = Helper.fakeFilterModel;
    component.originalReducedOverBetTypes = Helper.fakeReducedOverBetTypes;
    component.originalPlayers = Helper.fakePlayers;
    const betTypeIds = ['1'];

    // Act
    component.updateCheckedBetTypes(betTypeIds);

    // Assert
    expect(component.model.playerMultipleSelection.items.length).toBeGreaterThan(0);
    expect(component.primitivePropertyItem.isDisabledPlayer).toBeFalsy();
  });

  it('should not render players when bet type has no players', () => {
    // Arrange
    component.model = Helper.fakeFilterModel;
    component.originalReducedOverBetTypes = Helper.fakeReducedOverBetTypes;
    component.originalPlayers = Helper.fakePlayers;
    const betTypeIds = ['2'];

    // Act
    component.updateCheckedBetTypes(betTypeIds);

    // Assert
    expect(component.model.playerMultipleSelection.items.length).toBe(0);
    expect(component.primitivePropertyItem.isDisabledPlayer).toBeTruthy();
  });

  it('should update checked players', () => {
    // Arrange
    component.model = Helper.fakeFilterModel;
    const checkedPlayerIds = ['1', '2'];

    // Act
    component.updateCheckedPlayers(checkedPlayerIds);

    // Assert
    expect(component.model.playerIds).toEqual(checkedPlayerIds);
  });

  it('should emit add item event when not voided', () => {
    // Arrange
    component.isVoided = false;
    component.addItemEvent.emit = jest.fn();

    // Act
    component.addBetTypeItem();

    // Assert
    expect(component.addItemEvent.emit).toHaveBeenCalled();
  });

  it('should not emit add item event when voided', () => {
    // Arrange
    component.isVoided = true;
    component.addItemEvent.emit = jest.fn();

    // Act
    component.addBetTypeItem();

    // Assert
    expect(component.addItemEvent.emit).not.toHaveBeenCalled();
  });

  it('should emit remove item event when not voided', () => {
    // Arrange
    component.isVoided = false;
    component.removeItemEvent.emit = jest.fn();
    const index = 1;

    // Act
    component.removeBetTypeItem(index);

    // Assert
    expect(component.removeItemEvent.emit).toHaveBeenCalledWith(index);
  });

  it('should not emit remove item event when voided', () => {
    // Arrange
    component.isVoided = true;
    component.removeItemEvent.emit = jest.fn();
    const index = 1;

    // Act
    component.removeBetTypeItem(index);

    // Assert
    expect(component.removeItemEvent.emit).not.toHaveBeenCalled();
  });

  it('should validate single decimal runs', () => {
    // Arrange
    const value = '1.5';
    const elementClass = 'test-class';
    validationService.isValidSingleDecimalRuns = jest.fn().mockReturnValue(true);

    // Act
    const result = component.isValidSingleDecimalRuns(value, elementClass);

    // Assert
    expect(result).toBeTruthy();
    expect(validationService.isValidSingleDecimalRuns).toHaveBeenCalledWith(
      value,
      `${elementClass}${component.index}`,
      component.tooltip
    );
  });

  it('should validate only number wicket over', () => {
    // Arrange
    const value = '10';
    const elementClass = 'test-class';
    validationService.isValidOnlyNumberWicketOver = jest.fn().mockReturnValue(true);

    // Act
    const result = component.isValidOnlyNumberWicketOver(value, elementClass);

    // Assert
    expect(result).toBeTruthy();
    expect(validationService.isValidOnlyNumberWicketOver).toHaveBeenCalledWith(
      value,
      `${elementClass}${component.index}`,
      component.tooltip
    );
  });

  it('should validate all fields', () => {
    // Arrange
    component.model = Helper.fakeFilterModel;
    validationService.isAllFieldsHaveValue = jest.fn().mockReturnValue(true);

    // Act
    const result = component.isValid();

    // Assert
    expect(result).toBeTruthy();
    expect(validationService.isAllFieldsHaveValue).toHaveBeenCalledWith(
      component.model,
      component.index,
      component.primitivePropertyItem,
      component.tooltip
    );
  });
});
