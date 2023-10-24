import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Notification } from '../../../external/components/notification/notification';
import { CheckingPermissionModel } from './checking-permission.model';
import { CheckingPermissionService } from './checking-permission.service';

@Component({
  selector: 'checking-permission',
  templateUrl: './checking-permission.component.html',
  styleUrls: ['./checking-permission.component.scss']
})
export class CheckingPermissionComponent implements OnInit {
  @Input() checkingPermissionModel: CheckingPermissionModel;
  @Output() allow = new EventEmitter<boolean>();
  @Output() deny = new EventEmitter<boolean>();

  notificationPermission = new Notification();

  constructor(private checkingPermissionService: CheckingPermissionService) { }

  ngOnInit() {
  }

  checkPermission() {
    this.checkingPermissionService.checkVoidBetPermission(this.checkingPermissionModel).subscribe(data => {
      if (data.errCode !== 0) {
        this.notificationPermission.open('WARNING', data.errMsg);
      } else {
        this.allow.emit(true);
      }
    });
  }

  nextStepEvent() {
    this.deny.emit(true);
  }
}
