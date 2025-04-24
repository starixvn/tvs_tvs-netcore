import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Notification } from './notification';
import { SanitizeHtmlPipe } from '../../pipes/sanitize-html.pipe';

@Component({
    standalone: true,
    selector: 'notification',
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.scss'],
    imports: [SanitizeHtmlPipe]
})

export class NotificationComponent {
    @Input() notification: Notification;
    @Output() nextStepEvent = new EventEmitter<boolean>();

    nextStep() {
        this.notification.isShow = false;
        this.nextStepEvent.emit(true);
    }

    closeNotification() {
        this.notification.isShow = false;
    }
}