import { ElementRef, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Shallow } from 'shallow-render';
import { BlockUiModule } from 'src/utility/modules/block-ui/block-ui.module';
import { PipeModule } from 'src/utility/modules/pipes/pipe.module';
import { ToolTipModule } from 'src/utility/modules/tooltip/tooltip.module';
import { GroupBettypesPoolHouseComponent } from './group-bettypes-pool-house.component';
import { GroupBetTypesModel } from './group-bettypes-pool-house.model';

class Helper {
  static readonly inputsSelector = '.form-control';
  
}

describe('GroupBettypesPoolHouseComponent', () => { 
  @NgModule({
    declarations: [
    ],
    imports: [
      NgbModule,
      FormsModule,
      BlockUiModule,
      PipeModule,
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
        model: new GroupBetTypesModel([], true),
      }
    });

    expect(fixture).toMatchSnapshot();
  });
  
  it('ngOnInit should emit #changedBetTypesEvent', async () => {
    const { instance } = await shallow
    .render({
      bind: {
        model: new GroupBetTypesModel([], true),
      }
    });
    instance.checkedBetTypes = '1,2,3';
    instance.model.checkBetType = jest.fn();
    instance.changedBetTypesEvent.emit = jest.fn();

    instance.ngOnInit();

    expect(instance.model.checkBetType).toHaveBeenCalledTimes(1);
    expect(instance.changedBetTypesEvent.emit).toHaveBeenCalledTimes(1);
  });
  
  it('ngOnInit should not emit #changedBetTypesEvent', async () => {
    const { instance } = await shallow
    .render({
      bind: {
        model: new GroupBetTypesModel([], true),
      }
    });
    instance.checkedBetTypes = null;
    instance.changedBetTypesEvent.emit = jest.fn();

    instance.ngOnInit();

    expect(instance.changedBetTypesEvent.emit).toHaveBeenCalledTimes(0);
  });
  
  it('changedBetTypes should emit #changedBetTypesEvent', async () => {
    const { instance } = await shallow
    .render({
      bind: {
        model: new GroupBetTypesModel([], true),
      }
    });
    instance.changedBetTypesEvent.emit = jest.fn();

    instance.changedBetTypes();

    expect(instance.changedBetTypesEvent.emit).toHaveBeenCalledTimes(1);
  });
});