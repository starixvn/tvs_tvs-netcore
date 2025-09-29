import { Injectable, inject } from '@angular/core';
import forEach from 'lodash/forEach';
import { ItemsSelect } from '../../../utility/components/multiple-selection/items-select';
import { MultipleSelection } from '../../../utility/components/multiple-selection/multiple-selection.model';
import { ABExceptionListLevel } from '../../../utility/constants/config';
import { Selection } from '../../../utility/models/selection.model';
import { AppService } from '../app.service';
import { FilterModel } from '../filter/filter.model';
import { GroupSiteModel, SiteModel } from '../models/site.model';

@Injectable()
export class FilterService {
  appService = inject(AppService);

  async getSites(): Promise<GroupSiteModel[]> {
    return this.appService.getSites();
  }
  
  initDefaultFilter(filterModel: FilterModel, groupSites: GroupSiteModel[], selectedSubType: string[], voidVIPSelection: Selection[]): void {
    filterModel.username = '';
    filterModel.level = ABExceptionListLevel.All;
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
    forEach(subIssueTypes, function(item) {
      selections.push(
        {
          name: item.subIssueTypeName,
          value: item.subIssueTypeIds,
          group: 'All'
        }
      );
    });
    
    //TODO: only remove subtype on UI - feat: 173229
    return selections.filter(x => x.value !== '27,41');
  }

  private initDefaultProperties(multipleSelection: MultipleSelection): void {
    multipleSelection.checkAllCheckBoxText = 'All';
    multipleSelection.allItemsCheckedText = 'All';
    multipleSelection.noneItemCheckedText = 'Select options';
    multipleSelection.maxWidth = '170px';
    multipleSelection.numberItemsDisplay = 1;
  }
}