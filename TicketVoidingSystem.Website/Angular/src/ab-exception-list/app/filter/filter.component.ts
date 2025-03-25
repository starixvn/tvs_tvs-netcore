import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import * as _ from 'lodash';
import { MultipleSelectionComponent } from 'src/utility/components/multiple-selection/multiple-selection.component';
import { TooltipComponent } from 'src/utility/components/tooltip/tooltip.component';
import { MultipleSelection } from '../../../utility/components/multiple-selection/multiple-selection';
import { Tooltip } from '../../../utility/components/tooltip/tooltip.model';
import { ABExceptionListLevel, ABExceptionListVoidVIP } from '../../../utility/constants/config';
import { Selection } from '../../../utility/models/selection.model';
import { AppStore } from '../app.store';
import { PermissionABExceptionList } from '../models/permission.model';
import { GroupSiteModel } from '../models/site.model';
import { FilterService } from '../services/filter.service';
import { FilterModel } from './filter.model';

@Component({
  standalone: true,
  selector: 'filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  imports: [MultipleSelectionComponent, NgSelectModule, CommonModule, FormsModule, TooltipComponent],
  providers: [FilterService]
})
export class FilterComponent implements OnInit {
  @Input() filterModel = new FilterModel();
  @Input() permission = new PermissionABExceptionList();
  @Input() subTypeSelection: Selection[];
  @Output() subTypeSelectionChange = new EventEmitter<Selection[]>();
  @Output() filterModelChange = new EventEmitter<FilterModel>();
  @Output() addUserEvent = new EventEmitter();
  @Output() searchEvent = new EventEmitter();

  multipleSelection = new MultipleSelection();
  levels = ABExceptionListLevel.MULTIPLE_OPTIONS;
  groupSites: GroupSiteModel[];
  subTypeSelectionFilter: Selection[];
  selectedSubType: string[];
  voidVIPSelection = ABExceptionListVoidVIP.MULTIPLE_OPTIONS;
  selectedVoidVIP: string[];
  tooltip = new Tooltip();

  abExceptionListStore = inject(AppStore);
  filterService = inject(FilterService);
  element = inject(ElementRef);

  constructor() {
    this.tooltip.element = this.element;
  }

  async ngOnInit(): Promise<void> {
    await this.initData();
    this.clickSearch();
  }

  async initData() {
    this.abExceptionListStore.changeBlockingUiStatus(true);
    this.groupSites = await this.filterService.getSites();
    this.multipleSelection = this.filterService.initMultiSelectSites(this.groupSites);
    this.subTypeSelection = await this.filterService.initSubType();
    this.subTypeSelectionChange.emit(this.subTypeSelection);
    this.subTypeSelectionFilter = _.cloneDeep(this.subTypeSelection);
    this.subTypeSelectionFilter.unshift({ name: '(Blank)', value: '0', group: 'All' });
    this.selectedSubType = this.subTypeSelectionFilter.map(x => x.value);
    this.selectedVoidVIP = this.voidVIPSelection.map(x => x.value);
    this.abExceptionListStore.changeBlockingUiStatus(false);

    this.filterService.initDefaultFilter(this.filterModel, this.groupSites, this.selectedSubType, this.voidVIPSelection);
  }

  clickAddUser() {
    this.addUserEvent.emit();
  }

  clickSearch() {
    this.searchEvent.emit();
  }

  updateSelectedSites(selectedItems: string[]): void {
    this.filterModel.sites = selectedItems.join(',');
  }

  updateSelectedSubIssueType(): void {
    this.filterModel.subTypes = this.selectedSubType.join(',');
  }

  updateSelectedVoidVIP(): void {
    this.filterModel.voidVIP = this.selectedVoidVIP.join(',');
  }
}
