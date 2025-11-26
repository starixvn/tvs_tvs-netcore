import { Injectable, inject } from '@angular/core';
import groupBy from 'lodash/groupBy';
import { GroupOperator, OperatorDefault, OperatorInfo } from '../../../../add-request-new/component/others/others.model';
import { OthersService as BaseOthersService } from '../../../../add-request-new/component/others/others.service';
import { ActionRemark } from '../../constants/action-remark.constant';

@Injectable()
export class OthersService {
  private readonly baseOthersService = inject(BaseOthersService);

  async getOperators(matchId: number | null): Promise<OperatorInfo[]> {
    if (matchId) {
      return this.baseOthersService.getOperators(matchId.toString());
    }
    return [OperatorDefault.SUSPENDER, OperatorDefault.TRADER];
  }

  initializeGroupOperators(operators: OperatorInfo[]): GroupOperator[] {
    const groupOperators: GroupOperator[] = [];
    const groups = groupBy(operators, 'groupName');
    
    for (const groupName in groups) {
      if (Object.hasOwn(groups, groupName)) {
        const group = new GroupOperator(groupName, groups[groupName]);
        group.selected = group.items.some(x => x.operatorId !== 0)
          ? group.items.filter(x => x.operatorId !== 0)
          : [group.items.find(x => x.operatorId === 0)];
        groupOperators.push(group);
      }
    }

    return groupOperators;
  }

  updateSelectedOperators(groupOperators: GroupOperator[], operatorsList: OperatorInfo[] | null | undefined): void {
    if (!operatorsList || operatorsList.length === 0) {
      return;
    }

    for (const group of groupOperators) {
      const selected = operatorsList.filter(x => x.operatorType === group.items[0].operatorType);
      group.selected = !selected || selected.length === 0
        ? [group.items.find(x => x.operatorId === 0)]
        : group.items.filter(x => selected.some(y => y.operatorId === x.operatorId));
    }
  }

  validateAndNormalizeOperatorSelection(groupOperators: GroupOperator[]): void {
    for (const group of groupOperators) {
      if (group.selected.length === 0 || group.selected.at(-1)?.operatorId === 0) {
        group.selected = [group.items.find(x => x.operatorId === 0)];
      } else if (group.selected.length > 1) {
        group.selected = group.selected.filter(x => x.operatorId !== 0);
      }
    }
  }

  extractOperatorList(groupOperators: GroupOperator[]): OperatorInfo[] {
    let operatorList: OperatorInfo[] = [];
    for (const item of groupOperators) {
      operatorList = operatorList.concat(item.selected);
    }
    return operatorList.filter(x => x.operatorId !== 0);
  }

  getActionOptions(): { label: string; value: string }[] {
    return Array.from(ActionRemark.ACTION_REMARK.entries()).map(([value, label]) =>
      ({ value, label }));
  }
}
