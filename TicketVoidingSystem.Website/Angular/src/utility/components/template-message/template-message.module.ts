import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessagesComponent } from './messages/messages.component';
import { NgModule } from '@angular/core';
import { TemplateMessageComponent } from './template-message/template-message.component';
import { TemplateService } from './template-message/template.service';
import { ToolTipModule } from './../tooltip/tooltip.module';

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
    TemplateService
  ]
})
export class TemplateMessageModule { }
