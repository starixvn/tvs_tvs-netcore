import { ElementRef, NgModule, QueryList } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Shallow } from 'shallow-render';
import { MultipleSelection } from '../../../../../utility/components/multiple-selection/multiple-selection';
import { NgSelectMixtureModel } from '../../../../../utility/components/ng-select-mixture/ng-select-mixture.model';
import { FilterReducedOverItemComponent } from '../filter-reduced-over-item/filter-reduced-over-item.component';
import { FilterReducedOverModel } from '../models/filter-reduced-over.model';
import { FilterReducedOverService } from '../services/filter-reduced-over.service';
import { FilterReducedOverComponent } from './filter-reduced-over.component';
class Helper {
  static readonly fromDate = '2021-12-18 12:08:49.737';
  static readonly toDate = '2021-12-21 12:08:49.737';
  static readonly fakeFilterReducedOverModel: FilterReducedOverModel = {
    betTypeIds: [],
    playerIds: [],
    live: true,
    nonLive: true,
    runs: '',
    wicketOver: '',
    betTypeNgSelectMixtureModel: new NgSelectMixtureModel(),
    playerMultipleSelection: new MultipleSelection()
  };
}

describe('FilterReducedOverComponent', () => {
  @NgModule({
    declarations: [
      FilterReducedOverItemComponent
    ],
    imports: [
      NgbModule,
      FormsModule
    ],
    providers: [
      FilterReducedOverService
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<FilterReducedOverComponent>;

  beforeEach(() => {
    shallow = new Shallow(FilterReducedOverComponent, AppModuleTest)
      .dontMock(NgbModule)
      .mock(ElementRef, {});
  });

  it('FilterReducedOverComponent init should match snapshot', async () => {
    const component = new FilterReducedOverComponent(null);
    component.models = [Helper.fakeFilterReducedOverModel];

    expect(component).toMatchSnapshot();
  });

  it('changeFilter should emit #changeFilterEvent', async () => {
    const { instance } = await shallow
    .render({
      bind: {
        models: [Helper.fakeFilterReducedOverModel]
      }
    });
    instance.changeFilterEvent.emit = jest.fn();
    instance.changeFilter();

    expect(instance.changeFilterEvent.emit).toHaveBeenCalledTimes(1);
  });

  it('isValid should returen true', async () => {
    const { instance } = await shallow
    .render({
      bind: {
        models: [Helper.fakeFilterReducedOverModel]
      }
    });

    const filterItemComponent = new FilterReducedOverItemComponent(null, null, null);
    filterItemComponent.isValid = jest.fn().mockReturnValue(true);
    const filterItemComponents = new QueryList<FilterReducedOverItemComponent>();
    filterItemComponents.reset([...filterItemComponents.toArray(), filterItemComponent]);
    instance.filterItemComponents = filterItemComponents;
    const actual = instance.isValid();

    expect(actual).toBeTruthy();
  });

  it('addBetTypeItem should add new item to #models', async () => {
    const { instance } = await shallow
    .mock(FilterReducedOverService, { initDefaultFilter: jest.fn().mockReturnValue(new FilterReducedOverModel()) })
    .render({
      bind: {
        models: [Helper.fakeFilterReducedOverModel]
      }
    });
    instance.addBetTypeItem();

    expect(instance.models.length).toBe(2);
  });

  it('removeBetTypeItem should slice 1 item of #models', async () => {
    const { instance } = await shallow
    .mock(FilterReducedOverService, { initDefaultFilter: jest.fn().mockReturnValue(new FilterReducedOverModel()) })
    .render({
      bind: {
        models: [Helper.fakeFilterReducedOverModel]
      }
    });
    instance.models.push(new FilterReducedOverModel());
    instance.removeBetTypeItem(1);

    expect(instance.models.length).toBe(1);
  });
});