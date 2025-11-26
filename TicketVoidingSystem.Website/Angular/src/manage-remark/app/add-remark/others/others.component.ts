import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { GroupOperator } from '../../../../add-request-new/component/others/others.model';
import { CommonService } from '../../../../utility/services/common.service';
import { AddRemarkModel } from '../../models/add-remark.model';
import { ConfirmAddRemarkComponent } from '../confirm-add-remark/confirm-add-remark.component';
import { OthersService } from './others.service';

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
  @Input() isEdit: boolean;
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
    this.model.operatorsList = this.othersService.extractOperatorList(this.groupOperators);
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
