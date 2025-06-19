import { Component, ElementRef, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { BetIdsComponent } from '../../../utility/components/bet-ids/bet-ids.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GetTicketsQuery } from '../model/get-tickets.query';
import { AppService } from '../app.service';
import { TooltipComponent } from '../../../utility/components/tooltip/tooltip.component';
import { Tooltip } from '../../../utility/components/tooltip/tooltip.model';
import { ValidationService } from '../services/validation.service';

@Component({
  standalone: true,
  selector: 'filter',
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss',
  imports: [BetIdsComponent, FormsModule, CommonModule, TooltipComponent],
})
export class FilterComponent implements OnInit, OnChanges {
  @Input() invalidTransIds: string;
  @Input() movedTransIds: string;
  @Input() affectedLicensees: string;
  @ViewChild('betIds') betIdsComponent: BetIdsComponent;
  @Output() searchEvent = new EventEmitter<GetTicketsQuery>();
  @Output() changeEvent = new EventEmitter();

  @Output() removeInvalidTransIdsEvent = new EventEmitter<GetTicketsQuery>();
  appService = inject(AppService);
  validationService = inject(ValidationService);
  element = inject(ElementRef);

  tooltip = new Tooltip();
  remark: string[];
  isAbnormalBet = false;
  abnormalBetType = null;
  includeMainParlay = false;
  transIds = '';
  isShowRemoveInvalid = false;
  isShowAffectedLicensees = false;

  async ngOnInit(): Promise<void> {
    this.tooltip.element = this.element;
    this.remark = await this.appService.getRemark();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['invalidTransIds'] || changes['movedTransIds'] ) {
      this.validationService.highlightInvalidTransIds(this.betIdsComponent, this.invalidTransIds, this.movedTransIds);
      this.isShowRemoveInvalid = this.invalidTransIds?.length > 0;
    }
  }

  createTicketsQuery(): GetTicketsQuery {
    const query = {
      transIds: this.betIdsComponent.getAllBetIds(),
      abnormalBetType: this.abnormalBetType,
      includeMainParlay: this.includeMainParlay,
    };

    return query;
  }

  search() {
    if (this.betIdsComponent.isHasBetId()) {
      this.searchEvent.emit(this.createTicketsQuery());
    }
  }

  removeInvalidTransIds() {
    this.betIdsComponent.removeTransId(this.invalidTransIds);
    this.betIdsComponent.removeTransId(this.movedTransIds);

    this.removeInvalidTransIdsEvent.emit();
  }

  changeFilter(){
    this.changeEvent.emit();
  }

  resetFilter() {
    this.isAbnormalBet = false;
    this.transIds = '';
    this.isShowRemoveInvalid = false;
    this.isShowAffectedLicensees = false;
    this.includeMainParlay = false;
    this.abnormalBetType = null;
    this.betIdsComponent.clearBetId();
  }

  resetAllItemsToValid(){
    this.betIdsComponent.groupNumber.resetAllItemsToValid();  
  }

  changeAbnormalBetType(){
    if(this.includeMainParlay || !this.isAbnormalBet){
      this.abnormalBetType = null;
    }
    else if (this.isAbnormalBet) {
      this.abnormalBetType = "0";
    }
  }
}
