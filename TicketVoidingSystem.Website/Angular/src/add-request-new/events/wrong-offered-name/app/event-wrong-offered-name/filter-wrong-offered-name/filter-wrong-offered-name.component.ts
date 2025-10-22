
import { Component, ElementRef, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LicenseesComponent } from '../../../../../../utility/components/licensees/licensees.component';
import { GroupLicensee, GroupLicenseeModel, Licensee } from '../../../../../../utility/components/licensees/licensees.model';
import { MultipleSelection } from '../../../../../../utility/components/multiple-selection/multiple-selection.model';
import { MultipleSelectionComponent } from '../../../../../../utility/components/multiple-selection/multiple-selection.component';
import { TooltipComponent } from '../../../../../../utility/components/tooltip/tooltip.component';
import { Tooltip } from '../../../../../../utility/components/tooltip/tooltip.model';
import { Currency } from '../../../../../../utility/models/currency.model';
import { MatchModel } from '../../../../../../utility/models/match.model';
import { CommonService } from '../../../../../../utility/services/common.service';
import { AddRequestStore } from '../../../../../services/add-request.store';
import { FilterModel } from '../../../../../component/filter/filter.model';
import { FilterWrongOfferedNameModel } from '../models/filter-wrong-offered-name.model';
import { EventWrongOfferedNameService } from '../services/event-wrong-offered-name.service';
import { FilterWrongOfferedNameService } from '../services/filter-wrong-offered-name.service';
import { ValidationService } from '../services/validation.service';

@Component({
    selector: 'filter-wrong-offered-name',
    templateUrl: './filter-wrong-offered-name.component.html',
    styleUrls: ['./filter-wrong-offered-name.component.scss'],
    standalone: true,
    imports: [LicenseesComponent, FormsModule, TooltipComponent, MultipleSelectionComponent],
    providers: [FilterWrongOfferedNameService]
})
export class FilterWrongOfferedNameComponent implements OnInit, OnChanges {
  @Input() model = new FilterWrongOfferedNameModel();
  @Input() filterModel = new FilterModel();
  @Input() isEdit: boolean;
  @Input() matchModel = new MatchModel();
  @Output() changeFilterEvent = new EventEmitter();
  originalGroupLicensees: GroupLicensee[];
  originalCurrencies: Currency[];
  groupLicenseeModel = new GroupLicenseeModel([], false);
  multipleSelectCurrency = new MultipleSelection();
  tooltip = new Tooltip();

  private readonly element = inject(ElementRef);
  private readonly commonService = inject(CommonService);
  private readonly addRequestStore = inject(AddRequestStore);
  private readonly filterService = inject(FilterWrongOfferedNameService);
  private readonly validationService = inject(ValidationService);
  private readonly eventWrongOfferedNameService = inject(EventWrongOfferedNameService);

  constructor() {
    this.tooltip.element = this.element;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['filterModel'] && this.filterModel.isChangeSubTypeManual) {
      this.groupLicenseeModel = this.filterService.autoCheckLicensees(this.originalGroupLicensees, this.model, this.filterModel);
      this.multipleSelectCurrency = this.filterService.autoCheckCurrency(this.originalCurrencies, this.model, this.filterModel);
      this.eventWrongOfferedNameService.updateSelectedMatchToInput(this.matchModel, this.model, this.filterModel.subIssueTypeId);
      this.changeFilterEvent.emit();
    }
  }

  async ngOnInit() {
    this.addRequestStore.changeBlockingUiStatus(true);
    await this.renderGroupLicensees();
    await this.renderCurrency();
    this.addRequestStore.changeBlockingUiStatus(false);
  }

  async renderGroupLicensees() {
    this.originalGroupLicensees = await this.commonService.getGroupLicensees();
    this.groupLicenseeModel = this.filterService.renderGroupLicensees(this.isEdit, this.originalGroupLicensees, this.model, this.filterModel);
  }

  async renderCurrency() {
    this.originalCurrencies = await this.commonService.getCurrencies();
    this.multipleSelectCurrency = this.filterService.renderCurrency(this.isEdit, this.originalCurrencies, this.model, this.filterModel);
  }

  isValidity(): boolean {
    return this.filterService.isValidity(this.model, this.tooltip);
  }

  updateSelectedCurrency(selectedItems: string[]): void {
    this.model.currencyIds = selectedItems;
  }

  updateLicense(licensees: Licensee[]): void {
    this.model.licenseeNames = licensees.map(x => x.name);
  }

  changeFilter(): void {
    this.changeFilterEvent.emit();
  }

  isSubTypeChinese() {
    return this.validationService.isSubTypeChinese(this.filterModel.subIssueTypeId);
  }
}
