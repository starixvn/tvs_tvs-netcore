import { Injectable } from '@angular/core';
import { Message } from '../../messages/message';
import { TemplateReplace } from '../template.const';
import { TemplateValue } from '../template.model';
import { ReplaceMessageService } from './replace-message.service';

@Injectable(
  { providedIn: 'root' }
)
export class TemplateWrongOfferedService {

  constructor(
    private readonly replaceMessageService: ReplaceMessageService
  ) { }

  public replaceWrongNameTVS(templateValue: TemplateValue, message: Message): void {
    this.replaceMessageService.replaceAll(message, TemplateReplace.WRONG_NAME, templateValue.wrongName);
    this.replaceMessageService.replaceAll(message, TemplateReplace.ACTUAL_NAME, templateValue.actualName);
    this.replaceMessageService.replaceAll(message, TemplateReplace.WRONG_NAMET, templateValue.wrongNameT);
    this.replaceMessageService.replaceAll(message, TemplateReplace.ACTUAL_NAMET, templateValue.actualNameT);
    this.replaceMessageService.replaceAll(message, TemplateReplace.WRONG_NAMES, templateValue.wrongNameS);
    this.replaceMessageService.replaceAll(message, TemplateReplace.ACTUAL_NAMES, templateValue.actualNameS);
  }
}