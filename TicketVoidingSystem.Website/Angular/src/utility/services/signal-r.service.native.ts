import { EventEmitter, Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { VoidBetResultCode } from '../constants/void-bet-result-code';
import { RequestStatus, Result } from '../models/signal-r.model';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  public hubConnection: signalR.HubConnection;
  public requestStatusChange = new EventEmitter<RequestStatus[]>();

  constructor(private toastr: ToastrService) { }

  public async initializeConnection(): Promise<void> {
    this.configToastr();
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${window.location.origin}${document.body.getAttribute('root-url')}SignalR/NotificationHub`)
      .configureLogging(signalR.LogLevel.Trace)
      .build();

    this.registerShowVoidResultEvent(this.hubConnection);
    this.registerShowErrorMessage(this.hubConnection);
    this.registerReceiveRequestStatusModelEvent(this.hubConnection);
     await this.hubConnection.start();
  }

  private registerShowVoidResultEvent(connection: signalR.HubConnection): void {
    connection.on('showVoidResult', (results: Result[]) => {
      this.toastr.success(this.buildMessageForVoidResult(results), '');
    });
  }

  private registerShowErrorMessage(connection: signalR.HubConnection) {
    connection.on('showErrorMessage', (message: string) => {
      this.toastr.error(message);
    });
  }

  private registerReceiveRequestStatusModelEvent(connection: signalR.HubConnection): void {
    connection.on('updateRequestStatus', (model: RequestStatus[]) => {
      this.requestStatusChange.emit(model);
    });
  }

  private configToastr(): void {
    this.toastr.toastrConfig.enableHtml = true;
    this.toastr.toastrConfig.disableTimeOut = true;
    this.toastr.toastrConfig.closeButton = true;
    this.toastr.toastrConfig.toastClass = 'custom-toastr ngx-toastr';
    this.toastr.toastrConfig.positionClass = 'toast-bottom-right';
  }

  private buildMessageForVoidResult(results: Result[]): string {
    const exceptionResult = results.find(x => x.errorCode === VoidBetResultCode.EXCEPTION_RUN_AFTER_VOID);
    if (exceptionResult) {
      return `<div><span class="warn-custom warning-custom"></span><span class="failed-msg">&#160;${exceptionResult.errorMsg}</span></div>`;
    }

    let succeedLicenseeMsg = '';
    let failedLicenseeMsg = '';
    let sentLetsTalkMsg = '';
    const voidRequestMsg = results.find(x => x.errorCode === VoidBetResultCode.VOID_REQUEST_SUCCESS)?.errorMsg;
    const succeedLicenseeResult = results.find(x => x.errorCode === VoidBetResultCode.LICENSEE_SUCCESS);
    const failedLicenseeResult = results.find(x => x.errorCode === VoidBetResultCode.LICENSEE_FAIL);
    const sentLetsTalkResult = results.find(x => x.errorCode === VoidBetResultCode.SEND_LETSTALK_FAIL);

    if (succeedLicenseeResult?.errorMsg) {
      succeedLicenseeMsg = `<div class="licensee-success-msg"><span>- ${succeedLicenseeResult.errorMsg}</span></div>`;
    }
    if (failedLicenseeResult?.errorMsg) {
      failedLicenseeMsg = `<div><span class="warn-custom warning-custom"></span><span class="failed-msg">&#160;${failedLicenseeResult.errorMsg}</span></div>`;
    }
    if (sentLetsTalkResult?.errorMsg) {
      sentLetsTalkMsg = `<div><span class="warn-custom warning-custom"></span><span class="failed-msg">&#160;${sentLetsTalkResult.errorMsg}</span></div>`;
    }

    return `<div class="void-bet-notification"><div><span>- ${voidRequestMsg}</span></div>${succeedLicenseeMsg}${failedLicenseeMsg}${sentLetsTalkMsg}</div>`;
  }
}
