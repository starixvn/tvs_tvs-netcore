import { Injectable } from '@angular/core';
import _ from 'lodash';
import { Message } from '../../messages/message';
import { TemplateContent } from '../template.model';

@Injectable()
export class ReplaceMessageService {
 public replaceEachLanguage(outputMessage: Message, destination: string, value: TemplateContent): void {
    if (!_.isNil(value)) {
      outputMessage.contentEnglish = _.isNil(outputMessage.contentEnglish) ? '' :
      outputMessage.contentEnglish.replace(new RegExp(destination, 'g'), value.msgEnglish);
      outputMessage.contentChineseTraditional = _.isNil(outputMessage.contentChineseTraditional) ? '' :
      outputMessage.contentChineseTraditional.replace(new RegExp(destination, 'g'), value.msgChineseTraditional);
      outputMessage.contentChineseSimplified = _.isNil(outputMessage.contentChineseSimplified) ? '' :
      outputMessage.contentChineseSimplified.replace(new RegExp(destination, 'g'), value.msgChineseSimplified);
      outputMessage.contentNewChineseSimplified = _.isNil(outputMessage.contentNewChineseSimplified) ? '' :
      outputMessage.contentNewChineseSimplified.replace(new RegExp(destination, 'g'), value.msgChineseNewSimplified);
    }
  }

  public replaceAll(outputMessage: Message, destination: string, value: string): void {
    if (!_.isNil(value)) {
      outputMessage.contentEnglish = _.isNil(outputMessage.contentEnglish) ? '' :
      outputMessage.contentEnglish.replace(new RegExp(destination, 'g'), value);
      outputMessage.contentChineseTraditional = _.isNil(outputMessage.contentChineseTraditional) ? '' :
      outputMessage.contentChineseTraditional.replace(new RegExp(destination, 'g'), value);
      outputMessage.contentChineseSimplified = _.isNil(outputMessage.contentChineseSimplified) ? '' :
      outputMessage.contentChineseSimplified.replace(new RegExp(destination, 'g'), value);
      outputMessage.contentNewChineseSimplified = _.isNil(outputMessage.contentNewChineseSimplified) ? '' :
      outputMessage.contentNewChineseSimplified.replace(new RegExp(destination, 'g'), value);
    }
  }
}