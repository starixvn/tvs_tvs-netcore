import { NgModule } from '@angular/core';
import { Shallow } from 'shallow-render';
import { HttpService } from '../../../../utility/services/http.service';
import { ToolTipModule } from '../../tooltip/tooltip.module';
import { MessagesComponent } from '../messages/messages.component';
import { TemplateService } from './services/template.service';
import { TemplateMessageComponent } from './template-message.component';

describe('FilterComponent', () => {
  @NgModule({
    declarations: [
      MessagesComponent,
      TemplateMessageComponent
    ],
    imports: [
      ToolTipModule
    ],    
    providers: [
      HttpService,
      TemplateService
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<TemplateMessageComponent>;

  beforeEach(() => {
    shallow = new Shallow(TemplateMessageComponent, AppModuleTest);
  });  
  
  it('TemplateMessageComponent should init match snapshot', async () => {
    // Arrange
    const { fixture } = await shallow.render();
    fixture.detectChanges();

    // Assert
    expect(fixture).toMatchSnapshot();
  });
});
