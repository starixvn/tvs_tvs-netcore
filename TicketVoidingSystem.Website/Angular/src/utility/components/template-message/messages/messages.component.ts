import { Component, ElementRef, EventEmitter, inject, Input, Output } from '@angular/core';
import { TEXT } from '../../../../utility/constants/text';
import { Tooltip } from '../../tooltip/tooltip.model';
import { Message } from './message';
import { TooltipComponent } from '../../tooltip/tooltip.component';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
  imports: [TooltipComponent, FormsModule]
})

export class MessagesComponent {
  @Input() isShowMessages: boolean;
  @Input() message = new Message();
  @Output() messageChange = new EventEmitter<Message>();
  tooltip = new Tooltip();
  isShowOtherLanguage = false;
  marginX = 10;
  isShowContentMessage = false;

  element = inject(ElementRef);
  constructor() {
    this.tooltip.element = this.element;
  }
  
  checkValidationForMainLanguage(): boolean {
    if (!this.message.contentEnglish) {
      this.tooltip.display('english', TEXT.EMPTY_ENGLISH);
      return false;
    }
    if (this.message.contentEnglish.indexOf('@@') < 0) {
      this.tooltip.display('english', TEXT.INVALID_ENGLISH);
      return false;
    }
    if (!this.message.contentChineseTraditional) {
      this.tooltip.display('chinese-traditional', TEXT.EMPTY_CHINESE_TRADITIONAL);
      return false;
    }
    if (this.message.contentChineseTraditional.indexOf('@@') < 0) {
      this.tooltip.display('chinese-traditional', TEXT.INVALID_CHINESE_TRADITIONAL);
      return false;
    }
    if (!this.message.contentChineseSimplified) {
      this.tooltip.display('chinese-simplified', TEXT.EMPTY_CHINESE_SIMPLIFIED);
      return false;
    }
    if (this.message.contentChineseSimplified.indexOf('@@') < 0) {
      this.tooltip.display('chinese-simplified', TEXT.INVALID_CHINESE_SIMPLIFIED);
      return false;
    }
    if (!this.message.contentNewChineseSimplified) {
      this.tooltip.display('new-chinese-simplified', TEXT.EMPTY_NEW_CHINESE_SIMPLIFIED);
      return false;
    }
    if (this.message.contentNewChineseSimplified.indexOf('@@') < 0) {
      this.tooltip.display('new-chinese-simplified', TEXT.INVALID_NEW_CHINESE_SIMPLIFIED);
      return false;
    }

    return true;
  }

  checkContentOfOtherLanguage(content: string): boolean {
    return content && content.indexOf('@@') < 0;
  }

  checkValidationForOtherLanguage(): boolean {
    if (this.checkContentOfOtherLanguage(this.message.contentThai)) {
      this.tooltip.display('thai', TEXT.INVALID_THAI);
      return false;
    }
    if (this.checkContentOfOtherLanguage(this.message.contentKorean)) {
      this.tooltip.display('korean', TEXT.INVALID_KOREAN);
      return false;
    }
    if (this.checkContentOfOtherLanguage(this.message.contentJapanese)) {
      this.tooltip.display('japanese', TEXT.INVALID_JAPANESE);
      return false;
    }
    if (this.checkContentOfOtherLanguage(this.message.contentItalian)) {
      this.tooltip.display('italian', TEXT.INVALID_ITALIAN);
      return false;
    }
    if (this.checkContentOfOtherLanguage(this.message.contentSpanish)) {
      this.tooltip.display('spanish', TEXT.INVALID_SPANISH);
      return false;
    }
    
    return true;
  }

  checkValidation(): boolean {
    let validation = true;
    validation = this.checkValidationForMainLanguage();
    if (!validation) {
      return validation;
    }
    validation = this.checkValidationForOtherLanguage();
    if (!validation) {
      return validation;
    }

    return true;
  }

  clearData() {
    this.message = new Message();
  }

  changedMessage() {
    this.messageChange.emit(this.message);
  }

  getStyles() {
    return this.message.isTVSAddOrEditPage ? "" : "margin: 0 10px;";
  }

  public changedShowContentMessage() {
    this.isShowContentMessage = !this.isShowContentMessage;
  }
}
