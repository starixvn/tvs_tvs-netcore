import { Component, Input, ElementRef, Output, EventEmitter } from '@angular/core';
import { Tooltip } from '../../../external/components/tooltip/tooltip';
import { TEXT } from '../../../internal/shared/text';
import { Message } from './message';

@Component({
    selector: 'messages',
    templateUrl: './messages.component.html',
    styleUrls: ['./messages.component.scss']
})

export class MessagesComponent {
    @Input() isShowMessages: boolean;
    @Input() message = new Message();
    @Output() messageChange = new EventEmitter<Message>();
    tooltip = new Tooltip;

    constructor(private element: ElementRef) {
        this.tooltip.element = this.element;
    }

    checkValidation(): boolean {
        if (this.message.contentEnglish === '' || this.message.contentEnglish === undefined) {
            this.tooltip.display('english', TEXT.EMPTY_ENGLISH);
            return false;
        }
        if (this.message.contentEnglish.indexOf('@@') < 0) {
            this.tooltip.display('english', TEXT.INVALID_ENGLISH);
            return false;
        }
        if (this.message.contentChineseTraditional === '' || this.message.contentChineseTraditional === undefined) {
            this.tooltip.display('chinese-traditional', TEXT.EMPTY_CHINESE_TRADITIONAL);
            return false;
        }
        if (this.message.contentChineseTraditional.indexOf('@@') < 0) {
            this.tooltip.display('chinese-traditional', TEXT.INVALID_CHINESE_TRADITIONAL);
            return false;
        }
        if (this.message.contentChineseSimplified === '' || this.message.contentChineseSimplified === undefined) {
            this.tooltip.display('chinese-simplified', TEXT.EMPTY_CHINESE_SIMPLIFIED);
            return false;
        }
        if (this.message.contentChineseSimplified.indexOf('@@') < 0) {
            this.tooltip.display('chinese-simplified', TEXT.INVALID_CHINESE_SIMPLIFIED);
            return false;
        }
        if (this.message.contentNewChineseSimplified === '' || this.message.contentNewChineseSimplified === undefined) {
          this.tooltip.display('new-chinese-simplified', TEXT.EMPTY_NEW_CHINESE_SIMPLIFIED);
          return false;
        }
        if (this.message.contentNewChineseSimplified.indexOf('@@') < 0) {
            this.tooltip.display('new-chinese-simplified', TEXT.INVALID_NEW_CHINESE_SIMPLIFIED);
            return false;
        }
        if (this.message.contentThai !== '' && this.message.contentThai !== undefined && this.message.contentThai.indexOf('@@') < 0) {
            this.tooltip.display('thai', TEXT.INVALID_THAI);
            return false;
        }
        if (this.message.contentKorean !== '' && this.message.contentKorean !== undefined && this.message.contentKorean.indexOf('@@') < 0) {
            this.tooltip.display('korean', TEXT.INVALID_KOREAN);
            return false;
        }
        if (this.message.contentJapanese !== ''
            && this.message.contentJapanese !== undefined
            && this.message.contentJapanese.indexOf('@@') < 0) {
            this.tooltip.display('japanese', TEXT.INVALID_JAPANESE);
            return false;
        }
        if (this.message.contentItalian !== ''
            && this.message.contentItalian !== undefined
            && this.message.contentItalian.indexOf('@@') < 0) {
            this.tooltip.display('italian', TEXT.INVALID_ITALIAN);
            return false;
        }
        if (this.message.contentSpanish !== ''
            && this.message.contentSpanish !== undefined
            && this.message.contentSpanish.indexOf('@@') < 0) {
            this.tooltip.display('spanish', TEXT.INVALID_SPANISH);
            return false;
        }

        return true;
    }

    clearData() {
        this.message = new Message();
    }

    changedMessage() {
      this.messageChange.emit(this.message);
    }
}
