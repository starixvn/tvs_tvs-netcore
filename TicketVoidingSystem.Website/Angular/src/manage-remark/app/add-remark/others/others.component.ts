import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { AddRemarkModel } from '../../models/add-remark.model';
import { CommonService } from '../../../../utility/services/common.service';
import { GroupOperator } from '../../../../add-request-new/component/others/others.model';
import { OthersService } from './others.service';
import { ConfirmAddRemarkComponent } from '../confirm-add-remark/confirm-add-remark.component';

@Component({
  standalone: true,
  selector: 'others',
  templateUrl: './others.component.html',
  styleUrl: './others.component.scss',
  imports: [FormsModule, CommonModule, NgSelectModule, ConfirmAddRemarkComponent],
  providers: [OthersService]
})
export class OthersComponent implements OnInit {
  @Input() model: AddRemarkModel;
  @Output() save = new EventEmitter();
  @Output() confirmAddRemark = new EventEmitter();
  
  decidedBys: string[] = [];
  groupOperators: GroupOperator[] = [];
  actionOptions: { label: string; value: string }[] = [];
  isOpenConfirmAddRemark = false;

  private readonly commonService = inject(CommonService);
  private readonly othersService = inject(OthersService);

  async ngOnInit() {
    await this.loadInitialData();
  }

  private async loadInitialData(): Promise<void> {
    await this.reloadData();
    
    if (this.decidedBys.length === 0) {
      this.decidedBys = await this.commonService.getDecidedBy();
    }

    this.actionOptions = this.othersService.getActionOptions();
  }

  async reloadData(): Promise<void> {
    const operators = await this.othersService.getOperators(this.model.matchId);
    this.groupOperators = this.othersService.initializeGroupOperators(operators);
    this.othersService.updateSelectedOperators(this.groupOperators, this.model.operatorsList);
  }

  onSelectOperator(): void {
    this.othersService.validateAndNormalizeOperatorSelection(this.groupOperators);
    this.updateModel();
  }

  private updateModel(): void {
    this.model.operatorsList = this.othersService.extractOperatorList(this.groupOperators);
  }

  addDecidedBy(decidedBy: string): void {
    this.decidedBys.push(decidedBy);
  }

  saveClick(): void {
    this.save.emit();
  }

  onClickOkConfirmAddRemark(): void {
    this.isOpenConfirmAddRemark = false;
    this.confirmAddRemark.emit();
  }

  onClickCancelConfirmAddRemark(): void {
    this.isOpenConfirmAddRemark = false;
  }

  cancelClick(): void {
    this.model.isOpen = false;
  }
}
