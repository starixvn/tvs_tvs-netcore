import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { ItemsSelect } from '../../../utility/components/multiple-selection/items-select';
import { MultipleSelection } from '../../../utility/components/multiple-selection/multiple-selection';
import { ABWhiteListLevel } from '../../../utility/constants/config';
import { Selection } from '../../../utility/models/selection.model';
import { GroupSiteModel, SiteModel } from '../../../utility/models/site.model';
import { CommonService } from '../../../utility/services/common.service';
import { AppService } from '../app.service';
import { FilterModel } from '../filter/filter.model';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  constructor(
    private readonly appService: AppService,
    private readonly commonService: CommonService,
  ) { }

  async getSites(): Promise<GroupSiteModel[]> {
    return this.commonService.getSites();
  }

  initDefaultFilter(filterModel: FilterModel, groupSites: GroupSiteModel[], selectedSubType: string[], voidVIPSelection: Selection[]): void {
    filterModel.username = '';
    filterModel.level = ABWhiteListLevel.All;
    let siteModels: SiteModel[] = [];
    groupSites.forEach(x => {
      siteModels = [...siteModels, ...x.sites];
    });
    filterModel.sites = siteModels.map(x => x.siteId).join(',');
    filterModel.subTypes = selectedSubType.join(',');
    filterModel.voidVIP = voidVIPSelection.map(x => x.value).join(',');
  }

  initMultiSelectSites(groupSites: GroupSiteModel[]): MultipleSelection {
    const multipleSelection = new MultipleSelection();
    this.initDefaultProperties(multipleSelection);
    const items: ItemsSelect[] = [];
    groupSites.forEach(group => {
      if (group.groupName !== 'All' || group.groupId !== 'All') {
        const temp = [];
        group.sites.forEach(itemSelect => {
          temp.push(new ItemsSelect(0, itemSelect.siteId, itemSelect.siteName, true, true, true, []));
        });
        items.push(new ItemsSelect(0, group.groupId, group.groupName, true, true, true, temp));
      }
    });
    multipleSelection.items = items;

    return multipleSelection;
  }

  async initSubType(): Promise<Selection[]> {
    const selections = [];
    const subIssueTypes = await this.appService.getSubTypes();
    _.forEach(subIssueTypes, function (item) {
      selections.push(
        {
          name: item.subIssueTypeName,
          value: item.subIssueTypeIds,
          group: 'All'
        }
      );
    });

    return selections;
  }

  private initDefaultProperties(multipleSelection: MultipleSelection): void {
    multipleSelection.checkAllCheckBoxText = 'All';
    multipleSelection.allItemsCheckedText = 'All';
    multipleSelection.noneItemCheckedText = 'Select options';
    multipleSelection.maxWidth = '170px';
    multipleSelection.numberItemsDisplay = 1;
  }
}