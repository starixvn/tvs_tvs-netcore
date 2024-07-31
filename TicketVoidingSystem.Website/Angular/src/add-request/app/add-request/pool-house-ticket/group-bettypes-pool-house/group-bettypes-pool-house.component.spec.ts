import { ElementRef, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Shallow } from 'shallow-render';

import { GroupBettypesPoolHouseComponent } from './group-bettypes-pool-house.component';
import { GroupBetTypesModel } from './group-bettypes-pool-house.model';
import { ToolTipModule } from '../../../../../utility/components/tooltip/tooltip.module';

describe('GroupBettypesPoolHouseComponent', () => { 
  @NgModule({
    declarations: [
    ],
    imports: [
      NgbModule,
      FormsModule,
      ToolTipModule
    ],
    providers: [
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<GroupBettypesPoolHouseComponent>;

  beforeEach(() => {
    shallow = new Shallow(GroupBettypesPoolHouseComponent, AppModuleTest)
      .mock(ElementRef, {})
      .dontMock(NgbModule);
  });

  it('GroupBettypesPoolHouseComponent init should match snapshot', async () => {
    const { fixture } = await shallow
    .render({
      bind: {
        affectedGroupBetTypesModel: new GroupBetTypesModel([], true, false),
      }
    });

    expect(fixture).toMatchSnapshot();
  });
  
  it('ngOnInit should call #renderDisplayGroupBetTypes', async () => {
    const { instance } = await shallow
    .render({
      bind: {
        affectedGroupBetTypesModel: new GroupBetTypesModel([], true, false),
      }
    });
    instance['renderDisplayGroupBetTypes'] = jest.fn();

    instance.ngOnInit();

    expect(instance['renderDisplayGroupBetTypes']).toHaveBeenCalledTimes(1);
  });
  
  it('changedBetTypes should emit #changedBetTypesEvent', async () => {
    const { instance } = await shallow
    .render({
      bind: {
        affectedGroupBetTypesModel: new GroupBetTypesModel([], true, false),
      }
    });
    instance.changedBetTypesEvent.emit = jest.fn();

    instance.changedBetTypes();

    expect(instance.changedBetTypesEvent.emit).toHaveBeenCalledTimes(1);
  });
});