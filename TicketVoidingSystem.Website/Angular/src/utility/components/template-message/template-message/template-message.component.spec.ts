import { NgModule } from '@angular/core';
import { Shallow } from 'shallow-render';
import { HttpService } from '../../../../utility/services/http.service';
import { ToolTipModule } from '../../tooltip/tooltip.module';
import { MessagesComponent } from '../messages/messages.component';
import { ReplaceAIOMessageService } from './services/replace-aio-message.serivce';
import { ReplaceCommonValuesService } from './services/replace-common-values.service';
import { ReplaceEventTypeService } from './services/replace-event-type.service';
import { ReplacePlacedFromTimeRangeService } from './services/replace-placed-from-time-range.service';
import { ReplaceScoreService } from './services/replace-score.service';
import { ReplaceSpecialBetTypeService } from './services/replace-special-bet-type.service';
import { TemplateInputsForTVSService } from './services/template-inputs-for-tvs.service';
import { TemplateInputsService } from './services/template-inputs.service';
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
      TemplateService,
      ReplaceCommonValuesService,
      ReplacePlacedFromTimeRangeService,
      ReplaceEventTypeService,
      ReplaceScoreService,
      ReplaceAIOMessageService,
      ReplaceSpecialBetTypeService,
      TemplateInputsService,
      TemplateInputsForTVSService
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
