import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../../../utility/modules/testing.module';
import { FilterNotParticipateComponent } from './filter-not-participate.component';
import { FilterNotParticipateService } from '../services/filter-not-participate.service';
import { FilterNotParticipateModel } from '../models/filter-not-participate.model';
import { NotParticipateBetTypeModel, Player } from '../models/not-participate-bet-type.model';
import { MultipleSelection } from '../../../../../utility/components/multiple-selection/multiple-selection';

class Helper {
  static readonly fakeFilterModel: FilterNotParticipateModel[] = [{
    playerId: 1,
    betTypeIds: ['1'],
    betTypeMultipleSelection: new MultipleSelection()
  }];

  static readonly fakePlayers = [{
    playerId: 1,
    betTypeId: 1,
    oddsId: '1',
    playerName: 'Test Player',
    playNamesChineseSimplified: '',
    playNamesChineseTraditional: '',
    disabled: false
  }] as unknown as Player[];

  static readonly fakeBetTypes: NotParticipateBetTypeModel[] = [{
    betTypeId: 1,
    betTypeName: 'Test Bet Type',
    parentId: 1,
    playerId: 1,
    parentName: 'Test Parent'
  }];
}

describe('FilterNotParticipateComponent', () => {
  let component: FilterNotParticipateComponent;
  let fixture: ComponentFixture<FilterNotParticipateComponent>;
  let filterService: FilterNotParticipateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        FilterNotParticipateService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FilterNotParticipateComponent);
    filterService = fixture.debugElement.injector.get(FilterNotParticipateService);
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
    const mockFilterItem1 = { isValid: jest.fn().mockReturnValue(true) };
    const mockFilterItem2 = { isValid: jest.fn().mockReturnValue(true) };
    component.filterItemComponents = {
      toArray: jest.fn().mockReturnValue([mockFilterItem1, mockFilterItem2])
    } as any;

    // Act
    const result = component.isValid();

    // Assert
    expect(result).toBeTruthy();
    expect(mockFilterItem1.isValid).toHaveBeenCalled();
    expect(mockFilterItem2.isValid).toHaveBeenCalled();
  });

  it('should return false when any filter item is invalid', () => {
    // Arrange
    const mockFilterItem1 = { isValid: jest.fn().mockReturnValue(true) };
    const mockFilterItem2 = { isValid: jest.fn().mockReturnValue(false) };
    component.filterItemComponents = {
      toArray: jest.fn().mockReturnValue([mockFilterItem1, mockFilterItem2])
    } as any;

    // Act
    const result = component.isValid();

    // Assert
    expect(result).toBeFalsy();
  });

  it('should add new bet type item', () => {
    // Arrange
    component.models = [];
    filterService.initDefaultFilter = jest.fn().mockReturnValue({
      playerId: 0,
      betTypeIds: [],
      betTypeMultipleSelection: new MultipleSelection()
    });
    component.originalPlayers = Helper.fakePlayers;

    // Act
    component.addBetTypeItem();

    // Assert
    expect(component.models.length).toBe(1);
    expect(filterService.initDefaultFilter).toHaveBeenCalled();
  });

  it('should update status items when adding new bet type', () => {
    // Arrange
    component.models = [];
    component.originalPlayers = Helper.fakePlayers;
    filterService.initDefaultFilter = jest.fn().mockReturnValue({
      playerId: 1,
      betTypeIds: ['1'],
      betTypeMultipleSelection: new MultipleSelection()
    });

    // Act
    component.addBetTypeItem();

    // Assert
    expect(component.originalPlayers[0].disabled).toBeTruthy();
  });

  it('should remove bet type item', () => {
    // Arrange
    component.models = [...Helper.fakeFilterModel];
    component.originalPlayers = Helper.fakePlayers;

    // Act
    component.removeBetTypeItem(0);

    // Assert
    expect(component.models.length).toBe(0);
  });

  it('should update status items when removing bet type', () => {
    // Arrange
    component.models = [...Helper.fakeFilterModel];
    component.originalPlayers = Helper.fakePlayers;

    // Act
    component.removeBetTypeItem(0);

    // Assert
    expect(component.originalPlayers[0].disabled).toBeFalsy();
  });

  it('should update status items when changing bet type', () => {
    // Arrange
    component.models = [...Helper.fakeFilterModel];
    component.originalPlayers = Helper.fakePlayers;

    // Act
    component.changeBetTypeItem();

    // Assert
    expect(component.originalPlayers[0].disabled).toBeTruthy();
  });
});
