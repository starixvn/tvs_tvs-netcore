import { PipeModule } from './../../../../../utility/pipes/pipe.module';
import { ElementRef, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Shallow } from 'shallow-render';
import { TicketsComponent } from './tickets.component';
import { TicketsModel } from './tickets.model';
import { BlockUiModule } from './../../../../../utility/components/block-ui/block-ui.module';

describe('TicketsComponent', () => { 
  @NgModule({
    declarations: [
    ],
    imports: [
      NgbModule,
      FormsModule,
      BlockUiModule,
      PipeModule
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