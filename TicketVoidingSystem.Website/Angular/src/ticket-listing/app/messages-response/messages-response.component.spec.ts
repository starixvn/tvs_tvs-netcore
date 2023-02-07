import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Shallow } from 'shallow-render';
import { PipeModule } from '../../../utility/modules/pipes/pipe.module';
import { MessagesResponseComponent } from './messages-response.component';
import { MessagesResponse } from './messages-response.model';

describe('MessagesResponseComponent', () => {
  @NgModule({
    declarations: [
    ],
    imports: [
      FormsModule,
      PipeModule
    ],
    providers: []
  })
  class AppModuleTest { }

  let shallow: Shallow<MessagesResponseComponent>;

  beforeEach(() => {
    shallow = new Shallow(MessagesResponseComponent, AppModuleTest);
  });
  
  it('MessagesResponseComponent init should match snapshot', async () => {
    const { fixture } = await shallow
    .render({
      bind: {
        messagesResponse: new MessagesResponse()
      }
    });

    expect(fixture).toMatchSnapshot();
  });
  
  it('onClickResendData should emit resendDataEvent', async () => {
    const { instance } = await shallow
    .render({
      bind: {
        messagesResponse: new MessagesResponse()
      }
    });
    instance.resendDataEvent.emit = jest.fn();

    instance.onClickResendData(true);

    expect(instance.resendDataEvent.emit).toHaveBeenCalledTimes(1);
  });
});
