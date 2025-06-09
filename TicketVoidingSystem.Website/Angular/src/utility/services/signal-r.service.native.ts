import { EventEmitter, inject, Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { NotificationModel } from '../components/notification-popup/notification-popup.model';
import { RequestStatus } from '../models/signal-r.model';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  public hubConnection: signalR.HubConnection;
  public requestStatusChange = new EventEmitter<RequestStatus[]>();
  public notificationChange = new EventEmitter<NotificationModel>();
  public notificationIconClass = new EventEmitter<string>();
  toastr = inject(ToastrService);

  public async initializeConnection(): Promise<void> {
    this.configToastr();
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${window.location.origin}${document.body.getAttribute('root-url')}SignalR/NotificationHub`)
      .withKeepAliveInterval(10000)
      .configureLogging(signalR.LogLevel.Trace)
      .build();

    this.registerEvent();
    await this.hubConnection.start();
  }

  private registerEvent() {
    this.registerReceiveRequestStatusModelEvent();
    this.registerReceiveNotification()
  }

  private registerReceiveRequestStatusModelEvent() {
    this.hubConnection.on('updateRequestStatus', (model: RequestStatus[]) => {
      this.requestStatusChange.emit(model);
    });
  }

  private registerReceiveNotification() {
    this.hubConnection.on('pushNotification', (notification: NotificationModel) => {
      this.notificationChange.emit(notification);
      this.notificationIconClass.emit('fa-bell-ring fa-bell-unread');
    });
  }

  private configToastr(): void {
    this.toastr.toastrConfig.enableHtml = true;
    this.toastr.toastrConfig.disableTimeOut = true;
    this.toastr.toastrConfig.closeButton = true;
    this.toastr.toastrConfig.toastClass = 'custom-toastr ngx-toastr';
    this.toastr.toastrConfig.positionClass = 'toast-bottom-right';
    this.toastr.toastrConfig.easeTime = 200;
  }
}
