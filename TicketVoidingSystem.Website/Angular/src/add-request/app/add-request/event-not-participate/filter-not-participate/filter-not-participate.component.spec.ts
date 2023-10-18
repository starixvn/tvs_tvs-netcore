import { ElementRef, NgModule, QueryList } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Shallow } from 'shallow-render';
import { MultipleSelection } from '../../../../../utility/components/multiple-selection/multiple-selection';
import { FilterNotParticipateModel } from '../models/filter-not-participate.model';
import { NotParticipateBetType } from '../models/not-participate-bet-type.model';
import { FilterNotParticipateService } from '../services/filter-not-participate.service';
import { FilterNotParticipateItemComponent } from './filter-not-participate-item/filter-not-participate-item.component';
import { FilterNotParticipateComponent } from './filter-not-participate.component';
class Helper {
  static readonly fromDate = '2021-12-18 12:08:49.737';
  static readonly toDate = '2021-12-21 12:08:49.737';
  static readonly fakeFilterNotParticipateModel: FilterNotParticipateModel = {
    playerId: 0,
    groupBetTypeIds: [],
    groupBetTypeMultipleSelection: new MultipleSelection()
  };
  static readonly fakeNotParticipateBetTypes: NotParticipateBetType[] = [
    {
      betTypeId: 1,
      betTypeName: '1',
      disabled: false
    },
    {
      betTypeId: 2,
      betTypeName: '2',
      disabled: false
    }
  ];
}

describe('FilterNotParticipateComponent', () => {
  @NgModule({
    declarations: [
      FilterNotParticipateComponent,
      FilterNotParticipateItemComponent
    ],
    imports: [
      NgbModule,
      FormsModule
    ],
    providers: [
      FilterNotParticipateService
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<FilterNotParticipateComponent>;

  beforeEach(() => {
    shallow = new Shallow(FilterNotParticipateComponent, AppModuleTest)
      .dontMock(NgbModule)
      .mock(ElementRef, {});
  });

  it('FilterNotParticipateComponent init should match snapshot', async () => {
    const component = new FilterNotParticipateComponent(null);
    component.models = [Helper.fakeFilterNotParticipateModel];

    expect(component).toMatchSnapshot();
  });

  it('changeFilter should emit #changeFilterEvent', async () => {
    const { instance } = await shallow
    .render({
      bind: {
        models: [Helper.fakeFilterNotParticipateModel]
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
        models: [Helper.fakeFilterNotParticipateModel]
      }
    });

    const filterItemComponent = new FilterNotParticipateComponent(null);
    filterItemComponent.isValid = jest.fn().mockReturnValue(true);
    const filterItemComponents = new QueryList<FilterNotParticipateComponent>();
    filterItemComponents.reset([...filterItemComponents.toArray(), filterItemComponent]);
    instance.filterItemComponents = filterItemComponents;
    instance.originalNotParticipateBetTypes = Helper.fakeNotParticipateBetTypes;
    const actual = instance.isValid();

    expect(actual).toBeTruthy();
  });

  it('addBetTypeItem should add new item to #models', async () => {
    const { instance } = await shallow
    .mock(FilterNotParticipateService, { initDefaultFilter: jest.fn().mockReturnValue(new FilterNotParticipateModel()) })
    .render({
      bind: {
        models: [Helper.fakeFilterNotParticipateModel]
      }
    });
    instance.originalNotParticipateBetTypes = Helper.fakeNotParticipateBetTypes;
    instance.addBetTypeItem();

    expect(instance.models.length).toBe(2);
  });

  it('removeBetTypeItem should slice 1 item of #models', async () => {
    const { instance } = await shallow
    .mock(FilterNotParticipateService, { initDefaultFilter: jest.fn().mockReturnValue(new FilterNotParticipateModel()) })
    .render({
      bind: {
        models: [Helper.fakeFilterNotParticipateModel]
      }
    });
    instance.originalNotParticipateBetTypes = Helper.fakeNotParticipateBetTypes;
    instance.models.push(new FilterNotParticipateModel());
    instance.removeBetTypeItem(1);

    expect(instance.models.length).toBe(1);
  });

  it('changeBetTypeItem should call #updateStatusItem 1 times', async () => {
    const { instance } = await shallow
    .render({
      bind: {
        models: [Helper.fakeFilterNotParticipateModel]
      }
    });
    instance['updateStatusItem'] = jest.fn();
    instance.changeBetTypeItem();

    expect(instance['updateStatusItem']).toHaveBeenCalledTimes(1)
  });
});