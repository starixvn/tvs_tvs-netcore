import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectComponent } from '@ng-select/ng-select';
import * as _ from 'lodash';
import { StaticService } from '../../../../utility/services/static.service';
import { AddRequestApiService } from '../add-request-api.service';
import { AddRequestStore } from '../add-request.store';
import { GroupOperator, OperatorDefault, OperatorInfo, OthersModel } from './others.model';
import { OthersService } from './others.service';

@Component({
    selector: 'others',
    templateUrl: './others.component.html',
    styleUrls: ['./others.component.scss'],
    standalone: true,
    imports: [FormsModule, CommonModule, NgbModule, NgSelectComponent]
})
export class OthersComponent implements OnChanges, OnInit {
  @Input() isEdit: boolean;
  @Input() matchId: number;
  @Input() parentMatchId: number = null;
  @Input() issueTypeId: string;
  @Input() model = new OthersModel();
  @Output() modelChange = new EventEmitter<OthersModel>();
  isCollapse: boolean;

  operators: OperatorInfo[] = [];
  groupOperators: GroupOperator[] = [];
  decidedBys = [];

  constructor(
    private readonly othersService: OthersService,
    private readonly addRequestStore: AddRequestStore,
    private readonly addRequestApiService: AddRequestApiService
  ) { }

  async ngOnInit() {
    this.operators = [OperatorDefault.TRADER, OperatorDefault.SUSPENDER];
    this.intDefaultValueGroupOperators();
    if(this.decidedBys.length === 0 && this.isIssueTypeSupportSuggestion()){
      this.decidedBys = await this.addRequestApiService.GetDecidedBy();
    }
  }

  async ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if (changes['matchId']) {
      if (this.matchId) {
        this.addRequestStore.changeBlockingUiStatus(true);
        this.operators = await this.othersService.getOperators(this.matchId?.toString());
        await this.initProvider(this.isEdit, this.matchId, this.parentMatchId);
        this.addRequestStore.changeBlockingUiStatus(false);
      } else {
        this.operators = [OperatorDefault.TRADER, OperatorDefault.SUSPENDER];
      }

      this.intDefaultValueGroupOperators();
      this.updateSelectedValueGroupOperators();
    }
  }

  private intDefaultValueGroupOperators() {
    this.groupOperators = [];
    const groups = _.groupBy(this.operators, 'groupName');
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
    if (this.isEdit) {
      this.groupOperators.forEach(group => {
        const selected = this.model.operatorsList?.filter(x => x.operatorType === group.items[0].operatorType);
        group.selected = !selected || selected.length === 0 ? [group.items.find(x => x.operatorId === 0)]
          : group.items.filter(x => selected.findIndex(y => y.operatorId === x.operatorId) > -1);
      });
    }
    this.updateModel();
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

  updateModel() {
    this.updateOperatorList();
    this.modelChange.emit(this.model);
  }

  private updateOperatorList() {
    let operatorList = [];
    this.groupOperators.forEach(item => {
      operatorList = operatorList.concat(item.selected);
    });

    this.model.operatorsList = operatorList.filter(x => x.operatorId !== 0);
  }

  private async initProvider(isEdit: boolean, matchId: number, parentMatchId: number) {
    if (this.isIssueTypeSupportSuggestion() && !isEdit) {
      const id = parentMatchId ? parentMatchId : matchId;
      const provider = await this.othersService.getProvider(id);
      this.model.provider = provider?.providerName;
    }
  }

  addDecidedBy(decidedBy: string){
    this.decidedBys.push(decidedBy);
  }

  isIssueTypeSupportSuggestion(){
    return StaticService.isDangerAccepted(this.issueTypeId) || StaticService.isRedCard(this.issueTypeId) || StaticService.isWrongScore(this.issueTypeId);
  }
}
