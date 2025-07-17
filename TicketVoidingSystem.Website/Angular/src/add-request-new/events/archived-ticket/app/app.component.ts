import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import _ from 'lodash';
import { RequestModel } from '../../models/request.model';
import { FilterModel } from '../../../../add-request-new/component/filter/filter.model';
import { EventTicket14Component } from './event-ticket14/event-ticket14.component';
import { OthersAbnormalBetComponent } from '../../../../add-request-new/component/others-abnormal-bet/others-abnormal-bet.component';
import { EventBaseLayoutComponent } from '../../../../add-request-new/component/event-base-layout/event-base-layout.component';
import { IssueTypeConstant } from '../../../../utility/constants/issue-type.constant';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [EventBaseLayoutComponent, CommonModule, EventTicket14Component, OthersAbnormalBetComponent, 
    NgxSkeletonLoaderModule],
})
export class AppComponent  {
    @ViewChild('eventTicket14') eventTicket14Component: EventTicket14Component;
    @ViewChild('eventBaseLayout') eventBaseLayoutComponent: EventBaseLayoutComponent;

    model = new RequestModel();
    issueTypeId = IssueTypeConstant.ARCHIVED_TICKET;
    requestId?: number;
    isEdit = false;
    isDataReady = false;

    public async saveRequest(): Promise<void> {
      this.eventTicket14Component.saveRequest();
    }
  
    public updateFilter(filterModel: FilterModel): void {
      this.model.filter = _.clone(filterModel);
    }

    public reloadBaseData(): void {
      this.isEdit = this.eventBaseLayoutComponent.isEdit;

      if(this.isEdit){
        this.model = _.clone(this.eventBaseLayoutComponent.model);
        this.requestId = this.eventBaseLayoutComponent.requestId;
      }

      this.isDataReady = true;
    }
}