import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Notification } from './notification';

@Component({
    selector: 'notification',
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.scss']
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