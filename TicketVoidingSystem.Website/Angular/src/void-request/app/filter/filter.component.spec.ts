import { AdvancedModeComponent } from '../../../utility/components/advanced-mode/advanced-mode/advanced-mode.component';
import { CheckedBetType } from '../../../utility/components/advanced-mode/advanced-mode/advanced-mode.model';
import { GroupBetTypesComponent } from '../../../utility/components/advanced-mode/group-bettypes/group-bettypes.component';
import { BetType, GroupBetType, GroupBetTypesModel } from '../../../utility/components/advanced-mode/group-bettypes/group-bettypes.model';
import { FilterComponent } from './filter.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../utility/modules/testing.module';

class Helper {
  static readonly searchButtonSelector = 'input[type=submit]';
  static readonly fakeBetTypeList: BetType[] = [
    new BetType(15, '1H 1X2', false, 0, true),
    new BetType(4, 'Correct Score', false, 0, true),
    new BetType(216, 'Goal Scorer - Anytime', false, 0, true)
  ];
  static readonly fakeCheckedBetTypeList: CheckedBetType[] = [
    {
      betTeam: 'All',
      set: 'All',
      game: 'All',
      betOption: '',
      value: '',
      goal: '',
      id: 7,
      valueHdp1: '',
      valueHdp2: '',
      oddsSpread: '',
      oddsId: '',
      transdesc: '',
      virtualHead: ''
    },
    {
      betTeam: '',
      set: '',
      game: '',
      betOption: '1-0',
      value: 'All',
      goal: '',
      id: 8,
      valueHdp1: '',
      valueHdp2: '',
      oddsSpread: '',
      oddsId: '',
      transdesc: '',
      virtualHead: ''
    },
    {
      betTeam: '',
      set: '',
      game: '',
      betOption: '',
      value: '',
      goal: 'All',
      id: 10,
      valueHdp1: '',
      valueHdp2: '',
      oddsSpread: '',
      oddsId: '',
      transdesc: '',
      virtualHead: ''
    }
  ];
  static getFakeGroupBetTypesModel(): GroupBetTypesModel {
    const groupBetType: GroupBetType[] = [
      new GroupBetType('1H', [new BetType(15, '1H 1X2', false, 0, true)], true),
      new GroupBetType('FT', [new BetType(4, 'Correct Score', false, 0, true)], true),
      new GroupBetType('FT', [new BetType(216, 'Goal Scorer - Anytime', false, 0, true)], true),
    ];
    const groupBetTypesModel = new GroupBetTypesModel(groupBetType, true);
    return groupBetTypesModel;
  }
}

describe('FilterComponent', () => {
  let component: FilterComponent;
  let fixture: ComponentFixture<FilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupBetTypesComponent, AdvancedModeComponent, TestingModule]
    }).compileComponents();
    fixture = TestBed.createComponent(FilterComponent);
    component = fixture.componentInstance;
    component.groupBetTypesComponent = {} as GroupBetTypesComponent;
    component.advancedModelComponent = {} as AdvancedModeComponent;
  });

  it('#changeBetTypes should return expected allBetTypes', async () => {
    // Arrange & Action
    component.changeBetTypes(Helper.fakeBetTypeList);

    // Assert
    expect(component.allBetTypes).toStrictEqual(Helper.fakeBetTypeList);
  });

  it('#getBetTypeModels should emit search event with expected param', () => {
    // Arrange
    component.groupBetTypesComponent.validate = jest.fn().mockReturnValue(true);
    component.advancedModelComponent.validate = jest.fn().mockReturnValue(false);
    component.search.emit = jest.fn();

    // Act
    component.getBetTypeModels();

    // Assert
    expect(component.search.emit).toHaveBeenCalledTimes(1);
    expect(component.search.emit).toHaveBeenCalledWith(null);

    // Arrange for second call
    component.groupBetTypes = Helper.getFakeGroupBetTypesModel();
    component.groupBetTypes.getValueCheckedBetTypes = jest.fn();

    // Act
    component.getBetTypeModels();

    // Assert
    expect(component.search.emit).toHaveBeenCalledTimes(2);
  });

  it('FilterComponent should init match snapshot', async () => {
    // Arrange
    fixture.detectChanges();

    // Assert
    expect(component).toBeTruthy();
  });

  it('#getBetTypeModels should be called when clicking the search button', () => {
    // Arrange
    component.groupBetTypesComponent.validate = jest.fn().mockReturnValue(true);
    component.advancedModelComponent.validate = jest.fn().mockReturnValue(true);
    component.advancedModelComponent.getBetTypeModels = jest.fn();

    component.groupBetTypes = new GroupBetTypesModel([], false);
    component.search.emit = jest.fn();

    fixture.detectChanges();

    // Act
    const searchButton = fixture.nativeElement.querySelector(Helper.searchButtonSelector);
    searchButton.dispatchEvent(new Event('click'));

    // Assert
    expect(component.search.emit).toHaveBeenCalledTimes(1);
  });

  it('#ngOnChanges should update isShowSearch to true', async () => {
    component.groupBetTypes = Helper.getFakeGroupBetTypesModel();
    component.groupBetTypes.getCheckedBetTypes = jest.fn().mockImplementation(() => [1]);
    component.ngOnChanges();

    expect(component.isShowSearch).toBe(true);
  });

  it('#ngOnChanges should update isShowSearch to false', async () => {
    component.groupBetTypes = null;
    component.ngOnChanges();

    expect(component.isShowSearch).toBe(false);
  });
});
