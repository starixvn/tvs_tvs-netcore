import { FilterTimeItemComponent } from './filter-time-item.component';

describe('FilterTimeItemComponent', () => {
  it('#changeFilter should call output event changeFilter', async () => {
    // Arrange
    const fakeEventChangeFilter = jest.fn();
    const component = new FilterTimeItemComponent(null);
    component.changeFilterEvent.emit = fakeEventChangeFilter;

    // Action
    component.changeFilter();

    // Assert
    expect(fakeEventChangeFilter).toHaveBeenCalledTimes(1);
  });
});