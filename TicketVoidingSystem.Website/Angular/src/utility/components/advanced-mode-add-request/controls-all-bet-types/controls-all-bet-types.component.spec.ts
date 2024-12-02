import { ControlsAllBetTypesComponent } from './controls-all-bet-types.component';
import { ControlsAllBetTypesLists } from './controls-all-bet-types.model';

describe('ControlsAllBetTypesComponent', () => {
  it('#isShowContent should return true when betTeam has type controls All', () => {
    // Arrange
    const component = new ControlsAllBetTypesComponent();
    component.controlsAllBetTypesLists = ControlsAllBetTypesLists.MultipleSelectionList;
    component.controlsAllBetTypesLists[0].isShow = true;

    // Action & Asset
    expect(component.isShowContent()).toBeTruthy();
  });

  it('#updateByControlAllBetType should call event changeControlsAll when has change ControlsAllBetTypes', () => {
    // Arrange
    const component = new ControlsAllBetTypesComponent();
    const fakeEventChangeControlsAll = jest.fn();
    component.changeControlsAll.emit = fakeEventChangeControlsAll;

    // Action
    component.updateByControlAllBetType(["801","802"], "map");

    // Asset
    expect(fakeEventChangeControlsAll).toBeCalledTimes(1);
  });
});