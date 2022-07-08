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
      this.showMessageForVoidResult(results);
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
    this.toastr.toastrConfig.easeTime = 100;
  }

  private showMessageForVoidResult(results: Result[]): void {
    const exceptionResult = results.find(x => x.errorCode === VoidBetResultCode.EXCEPTION_RUN_AFTER_VOID);
    if (exceptionResult) {
      this.toastr.error(`<i class="fa-solid fa-triangle-exclamation icon"></i> ${exceptionResult.errorMsg}`);
      return;
    }

    let succeedLicenseeMsg = '';
    let failedLicenseeMsg = '';
    let failedSentLetsTalkMsg = '';
    const voidRequestMsg = results.find(x => x.errorCode === VoidBetResultCode.VOID_REQUEST_SUCCESS)?.errorMsg;
    const succeedLicenseeResult = results.find(x => x.errorCode === VoidBetResultCode.LICENSEE_SUCCESS);
    const failedLicenseeResult = results.find(x => x.errorCode === VoidBetResultCode.LICENSEE_FAIL);
    const failedSentLetsTalkResult = results.find(x => x.errorCode === VoidBetResultCode.SEND_LETSTALK_FAIL);

    if (succeedLicenseeResult?.errorMsg) {
      succeedLicenseeMsg = `<div><span>- ${succeedLicenseeResult.errorMsg}</span></div>`;
    }
    if (failedLicenseeResult?.errorMsg) {
      failedLicenseeMsg = `<div class="failed-msg"><i class="fa-solid fa-triangle-exclamation icon"></i><span class="msg"> ${failedLicenseeResult.errorMsg}</span></div>`;
    }
    if (failedSentLetsTalkResult?.errorMsg) {
      failedSentLetsTalkMsg = `<div class="failed-msg"><i class="fa-solid fa-triangle-exclamation icon"></i><span class="msg"> ${failedSentLetsTalkResult.errorMsg}</span></div>`;
    }

    const finalMessage = `<div class="void-bet-notification"><div><span>- ${voidRequestMsg}</span></div>${succeedLicenseeMsg}${failedLicenseeMsg}${failedSentLetsTalkMsg}</div>`;
    if (failedLicenseeMsg || failedSentLetsTalkMsg) {
      this.toastr.warning(finalMessage);
      return;
    }

    this.toastr.success(finalMessage);
  }
}
