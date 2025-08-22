import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../../utility/modules/testing.module';
import { GroupBetTypesComponent } from './group-bet-types.component';
import { GroupBetTypesAddRequestModel, GroupBetTypeAddRequest, BetTypeAddRequest } from './group-bet-types.model';
import { TEXT} from '../../../../utility/constants/text';
import { EventEmitter } from '@angular/core';

class Helper {
  static readonly fakeGroupBetTypes = [
    {
      name: 'Group 1',
      betTypes: [
        { id: 1, name: 'Bet Type 1', isChecked: true },
        { id: 2, name: 'Bet Type 2', isChecked: false }
      ]
    },
    {
      name: 'Group 2',
      betTypes: [
        { id: 3, name: 'Bet Type 3', isChecked: true },
        { id: 4, name: 'Bet Type 4', isChecked: false }
      ]
    }
  ] as unknown as GroupBetTypeAddRequest[];

  static readonly fakeModel = new GroupBetTypesAddRequestModel(Helper.fakeGroupBetTypes, false, '', false);
}

describe('GroupBetTypesComponent', () => {
  let component: GroupBetTypesComponent;
  let fixture: ComponentFixture<GroupBetTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(GroupBetTypesComponent);
    component = fixture.componentInstance;
    component.model = Helper.fakeModel;
    component.betTypesEvent = { emit: jest.fn() } as unknown as EventEmitter<BetTypeAddRequest[]>;
    component.checkExistBetTypeEvent = { emit: jest.fn() } as unknown as EventEmitter<boolean>;
    component.changeFilterEvent = { emit: jest.fn() } as unknown as EventEmitter<void>;
    component.tooltip = { display: jest.fn() } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.collapse).toBeTruthy();
    expect(component.tooltip).toBeTruthy();
    expect(component.element).toBeTruthy();
  });

  it('should emit all bet types when changeAllBetTypes is called', () => {
    // Act
    component.changeAllBetTypes();

    // Assert
    expect(component.changeFilterEvent.emit).toHaveBeenCalled();
    expect(component.betTypesEvent.emit).toHaveBeenCalledWith(component.model.getAllBetTypes());
  });

  it('should emit group bet types when changeGroupBetTypes is called', () => {
    // Arrange
    const group = Helper.fakeGroupBetTypes[0];

    // Act
    component.changeGroupBetTypes(group);

    // Assert
    expect(component.changeFilterEvent.emit).toHaveBeenCalled();
    expect(component.betTypesEvent.emit).toHaveBeenCalledWith(group.betTypes);
  });

  it('should emit single bet type when changeBetTypeItem is called', () => {
    // Arrange
    const betType = Helper.fakeGroupBetTypes[0].betTypes[0];

    // Act
    component.changeBetTypeItem(betType);

    // Assert
    expect(component.changeFilterEvent.emit).toHaveBeenCalled();
    expect(component.betTypesEvent.emit).toHaveBeenCalledWith([betType]);
  });

  it('should emit all bet types when changeBetTypes is called', () => {
    // Act
    component.changeBetTypes();

    // Assert
    expect(component.changeFilterEvent.emit).toHaveBeenCalled();
    expect(component.betTypesEvent.emit).toHaveBeenCalledWith(component.model.getAllBetTypes());
  });

  describe('isValidity', () => {
    it('should return false and emit false when no group bet types exist', () => {
      // Arrange
      component.model.groupBetTypes = [];

      // Act
      const result = component.isValidity();

      // Assert
      expect(result).toBeFalsy();
      expect(component.checkExistBetTypeEvent.emit).toHaveBeenCalledWith(false);
    });

    it('should return false and show tooltip when no bet types are checked', () => {
      // Arrange
      component.model.groupBetTypes = [
        {
          name: 'Group 1',
          betTypes: [
            { id: 1, name: 'Bet Type 1', isChecked: false },
            { id: 2, name: 'Bet Type 2', isChecked: false, isDisable: false }
          ]
        } as unknown as GroupBetTypeAddRequest
      ];

      // Act
      const result = component.isValidity();

      // Assert
      expect(result).toBeFalsy();
      expect(component.tooltip.display).toHaveBeenCalledWith('group-bettypes-all-checkbox', TEXT.NO_CHECKED_BETTYPE);
    });

    it('should return true when at least one bet type is checked', () => {
      // Arrange
      component.model.groupBetTypes = [
        {
          name: 'Group 1',
          betTypes: [
            { id: 1, name: 'Bet Type 1', isChecked: true },
            { id: 2, name: 'Bet Type 2', isChecked: false, isDisable: false }
          ]
        } as unknown as GroupBetTypeAddRequest
      ];

      // Act
      const result = component.isValidity();

      // Assert
      expect(result).toBeTruthy();
      expect(component.checkExistBetTypeEvent.emit).toHaveBeenCalledWith(true);
    });
  });
}); 