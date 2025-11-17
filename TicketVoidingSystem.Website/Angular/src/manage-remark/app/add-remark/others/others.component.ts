import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { AddRemarkModel } from '../../models/add-remark.model';
import { CommonService } from '../../../../utility/services/common.service';
import groupBy from 'lodash/groupBy';
import { GroupOperator, OperatorDefault, OperatorInfo } from '../../../../add-request-new/component/others/others.model';
import { OthersService } from '../../../../add-request-new/component/others/others.service';
import { ActionRemark } from '../../constants/action-remark.constant';

@Component({
  standalone: true,
  selector: 'others',
  templateUrl: './others.component.html',
  styleUrl: './others.component.scss',
  imports: [FormsModule, CommonModule, NgSelectModule]
})
export class OthersComponent implements OnInit, OnChanges {
  @Input() model: AddRemarkModel;
  @Output() save = new EventEmitter();
  decidedBys: string[] = [];
  operators: OperatorInfo[] = [];
  groupOperators: GroupOperator[] = [];
  actionOptions: { label: string; value: string }[] = [];

  private readonly commonService = inject(CommonService);
  private readonly othersService = inject(OthersService);

  async ngOnInit() {
    await this.reloadData();
    if (this.decidedBys.length === 0) {
      this.decidedBys = await this.commonService.getDecidedBy();
    }

    this.initActionOptions();
  }


  async ngOnChanges(changes: SimpleChanges) {
    if (changes['model']) {
      await this.reloadData();
    }
  }

  private async reloadData() {
    if (this.model.matchId) {
      this.operators = await this.othersService.getOperators(this.model.matchId.toString());
    } else {
      this.operators = [OperatorDefault.SUSPENDER, OperatorDefault.TRADER];
    }

    this.intDefaultValueGroupOperators();
    this.updateSelectedValueGroupOperators();
  }

  private initActionOptions() {
    this.actionOptions = Array.from(ActionRemark.ACTION_REMARK.entries()).map(([value, label]) =>
      ({ value, label }));
  }

  private intDefaultValueGroupOperators() {
    this.groupOperators = [];
    const groups = groupBy(this.operators, 'groupName');
    for (const groupName in groups) {
      if (groups.hasOwnProperty(groupName)) {
        const group = new GroupOperator(groupName, groups[groupName]);
        group.selected = group.items.some(x => x.operatorId !== 0)
          ? group.items.filter(x => x.operatorId !== 0)
          : [group.items.find(x => x.operatorId === 0)];
        this.groupOperators.push(group);
      }
    }
  }

  private updateSelectedValueGroupOperators() {
    this.groupOperators.forEach(group => {
      const groupName = group.name.toLowerCase();
      let selectedOperators: OperatorInfo[] = [];

      if (groupName === 'suspender' && this.model.suspender) {
        const matchedOperator = group.items.find(x => x.userName === this.model.suspender);
        if (matchedOperator) {
          selectedOperators = [matchedOperator];
        }
      } else if (groupName === 'trader' && this.model.trader) {
        const matchedOperator = group.items.find(x => x.userName === this.model.trader);
        if (matchedOperator) {
          selectedOperators = [matchedOperator];
        }
      }

      group.selected = selectedOperators.length > 0
        ? selectedOperators
        : [group.items.find(x => x.operatorId === 0)];
    });
  }

  onSelectOperator() {
    this.groupOperators.forEach(group => {
      if (group.selected.length === 0 || group.selected[group.selected.length - 1].operatorId === 0) {
        group.selected = [group.items.find(x => x.operatorId === 0)];
      } else if (group.selected.length > 1) {
        group.selected = group.selected.filter(x => x.operatorId !== 0);
      }
    });

    this.updateModel();
  }

  private updateModel() {
    this.updateOperatorList();
  }

  private updateOperatorList() {
    this.groupOperators.forEach(group => {
      const selectedOperator = group.selected.find(x => x.operatorId !== 0);
      const groupName = group.name.toLowerCase();

      if (groupName === 'suspender') {
        this.model.suspender = selectedOperator ? selectedOperator.userName : '';
      } else if (groupName === 'trader') {
        this.model.trader = selectedOperator ? selectedOperator.userName : '';
      }
    });
  }

  addDecidedBy(decidedBy: string) {
    this.decidedBys.push(decidedBy);
  }

  loadTvIptv() {
  }

  saveClick() {
    this.save.emit();
  }

  cancelClick(): void {
    this.model.isOpen = false;
  }
}
