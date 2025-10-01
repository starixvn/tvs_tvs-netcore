import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MultipleSelection } from '../../../../../../../utility/components/multiple-selection/multiple-selection.model';
import { MultipleSelectionComponent } from '../../../../../../../utility/components/multiple-selection/multiple-selection.component';
import { TooltipComponent } from '../../../../../../../utility/components/tooltip/tooltip.component';
import { TestingModule } from '../../../../../../../utility/modules/testing.module';
import { FilterNotParticipateModel } from '../../models/filter-not-participate.model';
import { NotParticipateBetTypeModel, Player } from '../../models/not-participate-bet-type.model';
import { FilterNotParticipateService } from '../../services/filter-not-participate.service';
import { ValidationService } from '../../services/validation.service';
import { FilterNotParticipateItemComponent } from './filter-not-participate-item.component';

class Helper {
  static readonly fakePlayer: Player = {
    playerId: 1,
    playerName: 'Test Player',
    disabled: false,
    betTypeId: 1,
    oddsId: '1',
    betChoice: '1',
    playNamesChineseSimplified: '',
    playNamesChineseTraditional: ''
  };

  static readonly fakeBetType: NotParticipateBetTypeModel = {
    playerId: 1,
    betTypeId: 1,
    betTypeName: 'Test Bet Type',
    parentId: 1,
    parentName: 'Test Parent'
  };

  static readonly fakeFilterModel: FilterNotParticipateModel = {
    playerId: 1,
    betTypeIds: ['1'],
    betTypeMultipleSelection: new MultipleSelection()
  };
}

describe('FilterNotParticipateItemComponent', () => {
  let component: FilterNotParticipateItemComponent;
  let fixture: ComponentFixture<FilterNotParticipateItemComponent>;
  let validationService: ValidationService;
  let filterService: FilterNotParticipateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TestingModule,
        NgSelectModule,
        FormsModule,
        CommonModule,
        MultipleSelectionComponent,
        TooltipComponent
      ],
      providers: [
        ValidationService,
        FilterNotParticipateService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FilterNotParticipateItemComponent);
    validationService = fixture.debugElement.injector.get(ValidationService);
    filterService = fixture.debugElement.injector.get(FilterNotParticipateService);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    // Arrange
    component.originalPlayers = [Helper.fakePlayer];
    component.originalBetTypes = [Helper.fakeBetType];
    component.model = Helper.fakeFilterModel;

    // Act
    component.ngOnInit();

    // Assert
    expect(component.distincedPlayers).toContain(Helper.fakePlayer);
  });

  it('should update checked player and reset bet types', () => {
    // Arrange
    const selectedPlayer = Helper.fakePlayer;
    component.changeBetTypeEvent = { emit: jest.fn() } as any;
    component.model = Helper.fakeFilterModel;
    component.originalBetTypes = [Helper.fakeBetType];
    component.model.betTypeMultipleSelection = new MultipleSelection();
    jest.spyOn(filterService, 'renderBetTypes').mockReturnValue([]);

    // Act
    component.updateCheckedPlayer(selectedPlayer);

    // Assert
    expect(component.changeBetTypeEvent.emit).toHaveBeenCalled();
    expect(component.model.betTypeIds).toEqual([]);
    expect(filterService.renderBetTypes).toHaveBeenCalled();
  });

  it('should render players correctly', () => {
    // Arrange
    component.originalPlayers = [Helper.fakePlayer];
    component.originalBetTypes = [Helper.fakeBetType];

    // Act
    component['renderPlayer']();

    // Assert
    expect(component.distincedPlayers).toContain(Helper.fakePlayer);
  });

  it('should render bet types by player', () => {
    // Arrange
    const playerId = 1;
    component.originalBetTypes = [Helper.fakeBetType];
    component.model = Helper.fakeFilterModel;
    component.model.betTypeMultipleSelection = new MultipleSelection();
    jest.spyOn(filterService, 'renderBetTypes').mockReturnValue([]);

    // Act
    component['renderBetTypesByPlayer'](playerId);

    // Assert
    expect(filterService.renderBetTypes).toHaveBeenCalled();
  });

  it('should emit change filter event', () => {
    // Arrange
    component.changeBetTypeEvent = { emit: jest.fn() } as any;
    component.changeFilterEvent = { emit: jest.fn() } as any;

    // Act
    component.changeFilter();

    // Assert
    expect(component.changeBetTypeEvent.emit).toHaveBeenCalled();
    expect(component.changeFilterEvent.emit).toHaveBeenCalled();
  });

  it('should validate fields correctly', () => {
    // Arrange
    component.model = Helper.fakeFilterModel;
    component.index = 0;
    jest.spyOn(validationService, 'isAllFieldsHaveValue').mockReturnValue(true);

    // Act
    const result = component.isValid();

    // Assert
    expect(result).toBeTruthy();
    expect(validationService.isAllFieldsHaveValue).toHaveBeenCalled();
  });

  it('should add bet type item when not voided', () => {
    // Arrange
    component.isVoided = false;
    component.addItemEvent = { emit: jest.fn() } as any;

    // Act
    component.addBetTypeItem();

    // Assert
    expect(component.addItemEvent.emit).toHaveBeenCalled();
  });

  it('should not add bet type item when voided', () => {
    // Arrange
    component.isVoided = true;
    component.addItemEvent = { emit: jest.fn() } as any;

    // Act
    component.addBetTypeItem();

    // Assert
    expect(component.addItemEvent.emit).not.toHaveBeenCalled();
  });

  it('should update checked bet types', () => {
    // Arrange
    const checkedPlayerIds = ['1', '2'];
    component.model = Helper.fakeFilterModel;

    // Act
    component.updateCheckedBetTypes(checkedPlayerIds);

    // Assert
    expect(component.model.betTypeIds).toEqual(checkedPlayerIds);
  });

  it('should remove bet type item when not voided', () => {
    // Arrange
    component.isVoided = false;
    component.removeItemEvent = { emit: jest.fn() } as any;
    const index = 0;

    // Act
    component.removeBetTypeItem(index);

    // Assert
    expect(component.removeItemEvent.emit).toHaveBeenCalledWith(index);
  });

  it('should not remove bet type item when voided', () => {
    // Arrange
    component.isVoided = true;
    component.removeItemEvent = { emit: jest.fn() } as any;
    const index = 0;

    // Act
    component.removeBetTypeItem(index);

    // Assert
    expect(component.removeItemEvent.emit).not.toHaveBeenCalled();
  });

  it('should reset bet types value', () => {
    // Arrange
    component.model = Helper.fakeFilterModel;
    component.model.betTypeIds = ['1', '2'];

    // Act
    component['resetBetTypesValue']();

    // Assert
    expect(component.model.betTypeIds).toEqual([]);
  });
});
