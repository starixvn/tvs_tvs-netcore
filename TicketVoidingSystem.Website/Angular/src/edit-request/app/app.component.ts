import { Component, inject, OnInit } from '@angular/core';
import { AddRequestComponent } from 'src/add-request/app/add-request/add-request.component';
import { RequestModel } from '../../add-request/app/add-request/models/request.model';
import { BlockFullUiComponent } from '../../utility/components/block-full-ui/block-full-ui.component';
import { MenuBarComponent } from '../../utility/components/menu-bar/menu-bar.component';
import { SignalRService } from '../../utility/services/signal-r.service.native';
import { AppService } from './app.service';
import { PrimitiveProperty } from './models/primitive-property.model';
import { RequestDetailViewModel } from './request.model';
import { LogInfoService } from './services/log-info.service';
import { ObjectService } from './services/object.service';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [MenuBarComponent, AddRequestComponent, BlockFullUiComponent]
})
export class AppComponent implements OnInit {
  detailViewModel = new RequestDetailViewModel();
  requestModel = new RequestModel();
  primitiveProperty = new PrimitiveProperty();
  actionIdOfFirstTimeAccess: string;
  isBlock = false;
  appService = inject(AppService);
  signalRService = inject(SignalRService);
  logInfoService = inject(LogInfoService);
  objectService = inject(ObjectService);

  async ngOnInit() {
    const url = window.location.href;
    const params = url.split('/');
    const requestId = parseInt(params[params.length - 1], 10);
    this.isBlock = true;
    this.detailViewModel = await this.appService.getRequestById(requestId);
    this.primitiveProperty = this.objectService.getPrimitiveProperty(this.detailViewModel, requestId);
    await this.logInfoService.getLogInfo(this.primitiveProperty, this.detailViewModel);
    this.objectService.mapRequestModel(this.requestModel, this.detailViewModel, this.primitiveProperty);
    this.isBlock = false;
    this.signalRService.initializeConnection();
  }
}
