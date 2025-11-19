import { Component, ViewChild, inject } from '@angular/core';
import { MenuBarComponent } from '../../utility/components/menu-bar/menu-bar.component';
import { BlockUiDirective } from '../../utility/components/block-ui/block-ui.directive';
import { AppService } from './app.service';
import { ModalService } from '../../utility/components/modal/modal.service';
import { CommonService } from '../../utility/services/common.service';
import { SignalRService } from '../../utility/services/signal-r.service.native';
import { FilterComponent } from './filter/filter.component';
import { FilterModel } from './models/filter.model';
import { AddRemarkComponent } from './add-remark/add-remark.component';
import { AddRemarkModel } from './models/add-remark.model';
import { RemarkListComponent } from './remark-list/remark-list.component';
import { RemarkModel } from './models/remark.model';
import clone from 'lodash/clone';
import { ModalType } from '../../utility/components/modal/modal.model';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [MenuBarComponent, BlockUiDirective, FilterComponent, AddRemarkComponent, RemarkListComponent]
})
export class AppComponent {
  @ViewChild('filterComponent') filterComponent: FilterComponent;
  @ViewChild('addRemarkComponent') addRemarkComponent: AddRemarkComponent;

  filter = new FilterModel();
  addRemarkModel = new AddRemarkModel();
  remarks: RemarkModel[] = [];

  appService = inject(AppService);
  commonService = inject(CommonService);
  modalService = inject(ModalService);
  signalRService = inject(SignalRService);
  
  isBlock = false;

  openAddRemark() {
    this.addRemarkModel = clone(new AddRemarkModel());
    this.addRemarkModel.isOpen = true;
  }

  async searchEvent() {
    let query = this.filterComponent.getQuery();
    this.isBlock = true;
    this.remarks = await this.appService.getRemarks(query);
    this.isBlock = false;
  }

  async exportExcel() {
    let query = this.filterComponent.getQuery();
    this.isBlock = true;
    await this.appService.exportRemark(query, () => this.timeoutEvent());
    this.isBlock = false;
  }

  private timeoutEvent(): void {
    this.modalService.open(
      {
        title: 'Warning!',
        message: 'Export Excel timeout. Please try again!!',
        type: ModalType.Warning
      });
  }
}
