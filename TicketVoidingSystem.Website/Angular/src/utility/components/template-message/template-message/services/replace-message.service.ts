import { Injectable } from '@angular/core';
import isNil from 'lodash/isNil';
import { Message } from '../../messages/message';
import { TemplateContent } from '../template.model';

@Injectable(
  { providedIn: 'root' }
)
export class ReplaceMessageService {
 public replaceEachLanguage(outputMessage: Message, destination: string, value: TemplateContent): void {
    if (!isNil(value)) {
      outputMessage.contentEnglish = isNil(outputMessage.contentEnglish) ? '' :
      outputMessage.contentEnglish.replace(new RegExp(destination, 'g'), value.msgEnglish);
      outputMessage.contentChineseTraditional = isNil(outputMessage.contentChineseTraditional) ? '' :
      outputMessage.contentChineseTraditional.replace(new RegExp(destination, 'g'), value.msgChineseTraditional);
      outputMessage.contentChineseSimplified = isNil(outputMessage.contentChineseSimplified) ? '' :
      outputMessage.contentChineseSimplified.replace(new RegExp(destination, 'g'), value.msgChineseSimplified);
      outputMessage.contentNewChineseSimplified = isNil(outputMessage.contentNewChineseSimplified) ? '' :
      outputMessage.contentNewChineseSimplified.replace(new RegExp(destination, 'g'), value.msgChineseNewSimplified);
    }
  }

  public replaceAll(outputMessage: Message, destination: string, value: string): void {
    if (!isNil(value)) {
      outputMessage.contentEnglish = isNil(outputMessage.contentEnglish) ? '' :
      outputMessage.contentEnglish.replace(new RegExp(destination, 'g'), value);
      outputMessage.contentChineseTraditional = isNil(outputMessage.contentChineseTraditional) ? '' :
      outputMessage.contentChineseTraditional.replace(new RegExp(destination, 'g'), value);
      outputMessage.contentChineseSimplified = isNil(outputMessage.contentChineseSimplified) ? '' :
      outputMessage.contentChineseSimplified.replace(new RegExp(destination, 'g'), value);
      outputMessage.contentNewChineseSimplified = isNil(outputMessage.contentNewChineseSimplified) ? '' :
      outputMessage.contentNewChineseSimplified.replace(new RegExp(destination, 'g'), value);
    }
  }
}