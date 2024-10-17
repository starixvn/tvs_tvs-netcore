import { ElementRef, NgModule, SimpleChange } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Shallow } from 'shallow-render';
import { AddRequestApiService } from '../../../../add-request/app/add-request/add-request-api.service';
import { BlockUiModule } from '../../../../utility/components/block-ui/block-ui.module';
import { ToolTipModule } from '../../../../utility/components/tooltip/tooltip.module';
import { PipeModule } from '../../../../utility/pipes/pipe.module';
import { AddRequestStore } from '../add-request.store';
import { PoolHouseTicketComponent } from './pool-house-ticket.component';
import { PoolHouseTicketsModel } from './pool-house-ticket.model';

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
      AddRequestApiService,
      AddRequestStore,
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<PoolHouseTicketComponent>;

  beforeEach(() => {
    shallow = new Shallow(PoolHouseTicketComponent, AppModuleTest)
      .mock(ElementRef, {})
      .dontMock(NgbModule);
  });

  it('PoolHouseTicketComponent init should match snapshot', async () => {
    const { fixture } = await shallow
    .render({
      bind: {
        model: new PoolHouseTicketsModel(),
      }
    });

    expect(fixture).toMatchSnapshot();
  });

  it('ngOnChanges should call #updatePoolHouseTicketModal', async () => {
    const { instance } = await shallow
    .render({
      bind: {
        model: new PoolHouseTicketsModel(),
      }
    });
    instance.model.isOpen = true;
    const changes = {
      'model': new SimpleChange(new PoolHouseTicketsModel(), new PoolHouseTicketsModel(), true)
    };
    instance['updatePoolHouseTicketModal'] = jest.fn();

    await instance.ngOnChanges(changes);

    expect(instance['updatePoolHouseTicketModal']).toHaveBeenCalledTimes(1);
  });

  it('closeClick should update model.isOpen false', async () => {
    const { instance } = await shallow
    .render({
      bind: {
        model: new PoolHouseTicketsModel(),
      }
    });

    instance.closeClick();

    expect(instance.model.isOpen).toBeFalsy();
  });

  it('saveClick should emit #saveEvent', async () => {
    const { instance } = await shallow
    .render({
      bind: {
        model: new PoolHouseTicketsModel(),
      }
    });
    instance['getCheckedBetTypes'] = jest.fn();

    instance.saveClick();

    expect(instance.model.isOpen).toBeFalsy();
  });
});
