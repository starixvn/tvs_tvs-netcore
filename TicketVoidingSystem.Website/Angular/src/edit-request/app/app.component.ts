import { Component, OnInit } from '@angular/core';
import { AddRequestComponent } from 'src/add-request/app/add-request/add-request.component';
import { BlockFullUiComponent } from 'src/utility/components/block-full-ui/block-full-ui.component';
import { MenuBarComponent } from 'src/utility/components/menu-bar/menu-bar.component';
import { RequestModel } from '../../add-request/app/add-request/models/request.model';
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

  constructor(
    private readonly appService: AppService,
    private readonly signalRService: SignalRService,
    private readonly logInfoService: LogInfoService,
    private readonly objectService: ObjectService,
  ) { }

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
