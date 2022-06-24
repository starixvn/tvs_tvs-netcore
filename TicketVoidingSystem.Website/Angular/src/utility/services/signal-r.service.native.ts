import { EventEmitter, Injectable } from '@angular/core';
import * as signalR from "@microsoft/signalr";
import * as toastr from 'toastr';
import { VoidBetResultCode } from '../constants/void-bet-result-code';
import { RequestStatus, Result } from '../models/signal-r.model';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  public connection: signalR.HubConnection;
  public proxy: SignalR.Hub.Proxy;
  requestStatusChange = new EventEmitter<RequestStatus[]>();

  constructor() { }

  public initializeConnection(): void {
    this.configToastr();
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl("/notificationHub")
      .build();
    this.registerShowVoidResultEvent(this.connection);
    this.registerShowErrorMessage(this.connection);
    this.registerReceiveRequestStatusModelEvent(this.connection);
    this.connection.start();
  }

  private registerShowVoidResultEvent(connection: signalR.HubConnection): void {
    connection.on("showVoidResult", (results: Result[]) => {
      toastr.info(this.buildMessageForVoidResult(results));
    });
  }

  private registerShowErrorMessage(connection: signalR.HubConnection) {
    connection.on('showErrorMessage', (message: string) => {
      toastr.error(message);
    });
  }

  private registerReceiveRequestStatusModelEvent(connection: signalR.HubConnection): void {
    connection.on('updateRequestStatus', (model: RequestStatus[]) => {
      this.requestStatusChange.emit(model);
    });
  }

  private configToastr(): void {
    toastr.options.closeButton = true;
    toastr.options.positionClass = 'toast-bottom-right';
    toastr.options.showDuration = 100;
    toastr.options.hideDuration = 200;
    toastr.options.timeOut = 0;
    toastr.options.extendedTimeOut = 0;
    toastr.options.showEasing = 'swing';
    toastr.options.hideEasing = 'linear';
    toastr.options.showMethod = 'fadeIn';
    toastr.options.hideMethod = 'slideUp';
    toastr.options.tapToDismiss = true;
    toastr.options.escapeHtml = false;
  }

  private buildMessageForVoidResult(results: Result[]): string {
    const exceptionResult = results.find(x => x.ErrorCode === VoidBetResultCode.EXCEPTION_RUN_AFTER_VOID);
    if (exceptionResult) {
      return `<div><span class="warn-custom warning-custom"></span><span class="failed-msg">&#160;${exceptionResult.ErrorMsg}</span></div>`;
    }
    
    let succeedLicenseeMsg = '';
    let failedLicenseeMsg = '';
    let sentLetsTalkMsg = '';
    const voidRequestMsg = results.find(x => x.ErrorCode === VoidBetResultCode.VOID_REQUEST_SUCCESS).ErrorMsg;
    const succeedLicenseeResult = results.find(x => x.ErrorCode === VoidBetResultCode.LICENSEE_SUCCESS);
    const failedLicenseeResult = results.find(x => x.ErrorCode === VoidBetResultCode.LICENSEE_FAIL);
    const sentLetsTalkResult = results.find(x => x.ErrorCode === VoidBetResultCode.SEND_LETSTALK_FAIL);

    if (succeedLicenseeResult?.ErrorMsg) {
      succeedLicenseeMsg = `<div class="licensee-success-msg"><span>- ${succeedLicenseeResult.ErrorMsg}</span></div>`;
    }
    if (failedLicenseeResult?.ErrorMsg) {
      failedLicenseeMsg = `<div><span class="warn-custom warning-custom"></span><span class="failed-msg">&#160;${failedLicenseeResult.ErrorMsg}</span></div>`;
    }
    if (sentLetsTalkResult?.ErrorMsg) {
      sentLetsTalkMsg = `<div><span class="warn-custom warning-custom"></span><span class="failed-msg">&#160;${sentLetsTalkResult.ErrorMsg}</span></div>`;
    }

    return `<div class="void-bet-notification"><div><span>- ${voidRequestMsg}</span></div>${succeedLicenseeMsg}${failedLicenseeMsg}${sentLetsTalkMsg}</div>`;
  }
}
