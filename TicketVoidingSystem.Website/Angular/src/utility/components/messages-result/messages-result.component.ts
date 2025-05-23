import { Component, Input, SimpleChange } from '@angular/core';
import { MessagesResult } from './messages-result';
import { CommonModule } from '@angular/common';
import { SanitizeHtmlPipe } from '../../modules/sanitize-html.pipe';

@Component({
    standalone: true,
    selector: 'messages-result',
    templateUrl: './messages-result.component.html',
    styleUrls: ['messages-result.component.scss'],
    imports: [CommonModule, SanitizeHtmlPipe]
})

export class MessagesResultComponent {
    @Input() messagesResult: MessagesResult;

    ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
        if (changes['messagesResult']) {
            this.replaceErrorMessageLockMatch(this.messagesResult);
        }
    }

    private replaceErrorMessageLockMatch(result: MessagesResult): void {
        if (!result || !result.results || result.results.length === 0) {
            return;
        }

        const ERROR_CODE_LOCK_MATCH = [1000000, 101, 100, 103, 102];
        result.results.forEach(x => {
            if (ERROR_CODE_LOCK_MATCH.includes(x.errorCode)) {
                x.errorMsg = `Some tickets cannot be processed because: ${x.errorMsg}`;
            }
        });
    }
}