import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { MenuBarComponent } from 'src/utility/components/menu-bar/menu-bar.component';
import { BlockUiDirective } from 'src/utility/components/block-ui/block-ui.directive';
import { AppService } from './app.service';
import { ModalService } from 'src/utility/components/modal/modal.service';
import { CommonService } from 'src/utility/services/common.service';
import { SignalRService } from 'src/utility/services/signal-r.service.native';
import { FilterComponent } from './filter/filter.component';
import { FilterModel } from './models/filter.model';
import { AddRemarkComponent } from './add-remark/add-remark.component';
import { AddRemarkModel } from './models/add-remark.model';
import clone from 'lodash/clone';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [MenuBarComponent, BlockUiDirective, FilterComponent, AddRemarkComponent]
})
export class AppComponent {
  @ViewChild('filterComponent') filterComponent: FilterComponent;
  @ViewChild('addRemarkComponent') addRemarkComponent: AddRemarkComponent;

  filter = new FilterModel();
  addRemarkModel = new AddRemarkModel();

  appService = inject(AppService);
  commonService = inject(CommonService);
  modalService = inject(ModalService);
  signalRService = inject(SignalRService);

  openAddRemark() {
    this.addRemarkModel = clone(new AddRemarkModel());
    this.addRemarkModel.isOpen = true;
  }
}
