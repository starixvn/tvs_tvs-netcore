import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ToolTipModule } from './../tooltip/tooltip.module';
import { MessagesComponent } from './messages/messages.component';
import { ReplaceAIOMessageService } from './template-message/services/replace-aio-message.serivce';
import { ReplaceCommonValuesService } from './template-message/services/replace-common-values.service';
import { ReplaceEventTypeService } from './template-message/services/replace-event-type.service';
import { ReplaceMessageService } from './template-message/services/replace-message.service';
import { ReplacePlacedFromTimeRangeService } from './template-message/services/replace-placed-from-time-range.service';
import { ReplaceScoreService } from './template-message/services/replace-score.service';
import { ReplaceSpecialBetTypeService } from './template-message/services/replace-special-bet-type.service';
import { TemplateInputsForTVSService } from './template-message/services/template-inputs-for-tvs.service';
import { TemplateInputsService } from './template-message/services/template-inputs.service';
import { TemplateWrongOddsSportBookService } from './template-message/services/template-wrong-odds-sport-book.service';
import { TemplateWrongOddsService } from './template-message/services/template-wrong-odds.service';
import { TemplateWrongScoreService } from './template-message/services/template-wrong-score.service';
import { TemplateService } from './template-message/services/template.service';
import { TemplateMessageComponent } from './template-message/template-message.component';

@NgModule({
  declarations: [
    MessagesComponent,
    TemplateMessageComponent
  ],
  exports: [
    MessagesComponent,
    TemplateMessageComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ToolTipModule
  ],
  providers: [
    TemplateService,
    TemplateWrongScoreService,
    TemplateWrongOddsService,
    TemplateWrongOddsSportBookService,
    TemplateInputsForTVSService,
    TemplateInputsService,
    ReplaceAIOMessageService,
    ReplaceCommonValuesService,
    ReplaceEventTypeService,
    ReplaceMessageService,
    ReplacePlacedFromTimeRangeService,
    ReplaceScoreService,
    ReplaceSpecialBetTypeService
  ]
})
export class TemplateMessageModule { }
