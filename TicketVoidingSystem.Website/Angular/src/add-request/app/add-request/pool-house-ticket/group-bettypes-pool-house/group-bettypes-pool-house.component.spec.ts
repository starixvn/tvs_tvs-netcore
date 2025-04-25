import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../../../utility/modules/testing.module';
import { GroupBettypesPoolHouseComponent } from './group-bettypes-pool-house.component';
import { GroupBetTypesModel, GroupBetType, BetType } from './group-bettypes-pool-house.model';

describe('GroupBettypesPoolHouseComponent', () => {
  let component: GroupBettypesPoolHouseComponent;
  let fixture: ComponentFixture<GroupBettypesPoolHouseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: []
    }).compileComponents();

    fixture = TestBed.createComponent(GroupBettypesPoolHouseComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    // Arrange
    const emptyGroups: GroupBetType[] = [];
    component.affectedGroupBetTypesModel = new GroupBetTypesModel(emptyGroups, false, false);
    component.othersGroupBetTypesModel = new GroupBetTypesModel(emptyGroups, false, false);

    // Act
    component.ngOnInit();

    // Assert
    expect(component.displayGroupBetTypesModel.length).toBe(2);
    expect(component.displayGroupBetTypesModel[0]).toBe(component.affectedGroupBetTypesModel);
    expect(component.displayGroupBetTypesModel[1]).toBe(component.othersGroupBetTypesModel);
  });

  it('should show group bet types when group is valid', () => {
    // Arrange
    const betTypes = [new BetType(1, 'Test', false, false)];
    const groupBetTypes = [new GroupBetType('Test Group', betTypes, false, false)];
    const validGroup = new GroupBetTypesModel(groupBetTypes, false, false);

    // Act
    const result = component.isShowGroupBetTypes(validGroup);

    // Assert
    expect(result).toBeTruthy();
  });

  it('should not show group bet types when group is null', () => {
    // Act
    const result = component.isShowGroupBetTypes(null);

    // Assert
    expect(result).toBeFalsy();
  });

  it('should not show group bet types when group is undefined', () => {
    // Act
    const result = component.isShowGroupBetTypes(undefined);

    // Assert
    expect(result).toBeFalsy();
  });

  it('should not show group bet types when group has empty bet types', () => {
    // Arrange
    const emptyGroups: GroupBetType[] = [];
    const emptyGroup = new GroupBetTypesModel(emptyGroups, false, false);

    // Act
    const result = component.isShowGroupBetTypes(emptyGroup);

    // Assert
    expect(result).toBeFalsy();
  });

  it('should emit changed bet types event when bet types change', () => {
    // Arrange
    component.changedBetTypesEvent.emit = jest.fn();
    const betTypes = [new BetType(1, 'Test', true, false)];
    const groupBetTypes = [new GroupBetType('Test Group', betTypes, false, false)];
    component.affectedGroupBetTypesModel = new GroupBetTypesModel(groupBetTypes, false, false);

    // Act
    component.changedBetTypes();

    // Assert
    expect(component.changedBetTypesEvent.emit).toHaveBeenCalled();
  });
});
