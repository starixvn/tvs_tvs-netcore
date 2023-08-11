import { ElementRef, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Shallow } from 'shallow-render';
import { BlockUiModule } from '../../../modules/block-ui/block-ui.module';
import { PagingModule } from '../../../modules/paging/paging.module';
import { PipeModule } from '../../../modules/pipes/pipe.module';
import { ToolTipModule } from '../../../modules/tooltip/tooltip.module';
import { TicketsComponent } from './tickets.component';
import { TicketsModel } from './tickets.model';

class Helper {
  static readonly inputsSelector = '.form-control';
  
}

describe('TicketsComponent', () => { 
  @NgModule({
    declarations: [
    ],
    imports: [
      NgbModule,
      FormsModule,
      BlockUiModule,
      PipeModule,
      ToolTipModule,
      PagingModule
    ],
    providers: [
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<TicketsComponent>;

  beforeEach(() => {
    shallow = new Shallow(TicketsComponent, AppModuleTest)
      .mock(ElementRef, {})
      .dontMock(NgbModule);
  });

  it('TicketsComponent init should match snapshot', async () => {
    const { fixture } = await shallow
    .render({
      bind: {
        model: new TicketsModel(),
      }
    });

    expect(fixture).toMatchSnapshot();
  });
  
  it('changeTickets should emit ticketsChange', async () => {
    const { instance } = await shallow
    .render({
      bind: {
        model: new TicketsModel(),
      }
    });
    instance.model.getNumberOfCheckedTickets = jest.fn();
    instance.ticketsChange.emit = jest.fn();

    instance.changeTickets();

    expect(instance.ticketsChange.emit).toHaveBeenCalledTimes(1);
  });
  
  it('pagingEvent should emit ticketsChange', async () => {
    const { instance } = await shallow
    .render({
      bind: {
        model: new TicketsModel(),
      }
    });
    instance.pagingChange.emit = jest.fn();

    instance.pagingEvent();

    expect(instance.pagingChange.emit).toHaveBeenCalledTimes(1);
  });
});