import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { BetIdsComponent } from '../../../utility/components/bet-ids/bet-ids.component';
import { BlockUiDirective } from '../../../utility/components/block-ui/block-ui.directive';
import { TooltipComponent } from '../../../utility/components/tooltip/tooltip.component';
import { Tooltip } from '../../../utility/components/tooltip/tooltip.model';
import { TEXT } from '../../../utility/constants/text';
import { AppApiService } from '../app-api.service';
import { InsertBetTicket14ResultModel, UpdateSummaryStatusModel } from './correct-summary-ticket.model';

@Component({
  selector: 'correct-summary-ticket',
  standalone: true,
  imports: [TooltipComponent, NgbAccordionModule, FormsModule,
    BetIdsComponent, BlockUiDirective, CommonModule
  ],
  templateUrl: './correct-summary-ticket.component.html',
  styleUrl: './correct-summary-ticket.component.scss'
})
export class CorrectSummaryTicketComponent {
  @ViewChild('betIds') betIdsComponent: BetIdsComponent;

  tooltip = new Tooltip();
  isBlock: boolean;
  isDisabledBetIds: boolean;
  statusInsertBetTicket14 = new UpdateSummaryStatusModel(false);
  statusUpdateSummaryTicket19999 = new UpdateSummaryStatusModel(true);

  appApiService = inject(AppApiService);

  public resetAll() {
    this.betIdsComponent.clearBetId();
    this.isDisabledBetIds = false;
    this.statusInsertBetTicket14 = new UpdateSummaryStatusModel(false);
    this.statusUpdateSummaryTicket19999 = new UpdateSummaryStatusModel(true);
  }

  public async insertBetTicket14() {
    if (!this.betIdsComponent.isHasBetId()) {
      return;
    }
    this.beforeInsertBetTicket14();
    this.isBlock = true;
    const transIds = this.betIdsComponent.getAllBetIds();
    const result = await this.appApiService.insertBetTicket14(transIds);
    this.afterInsertBetTicket14(result);
    this.isBlock = false;
  }

  public async updateSummaryTicket19999() {
    this.isBlock = true;
    const result = await this.appApiService.updateSummaryTicket19999();
    if (result.isSuccessful) {
      this.statusUpdateSummaryTicket19999.status = 'Successfully!';
      this.statusUpdateSummaryTicket19999.isDisableButton = true;
    } else {
      this.statusUpdateSummaryTicket19999.status = 'Failed!';
      this.statusUpdateSummaryTicket19999.isFailed = true;
    }
    this.isBlock = false;
  }

  private beforeInsertBetTicket14() {
    this.betIdsComponent.groupNumber.resetAllItemsToValid();
    this.betIdsComponent.groupNumber.checkDuplicatedItems();
  }

  private afterInsertBetTicket14(result: InsertBetTicket14ResultModel) {
    const isPassedValidation = result.invalidTransIds.length === 0 && result.balanceUpTransIds.length === 0;
    if (isPassedValidation) {
      this.updateDateWhenSuccess(result)
    } else {
      this.updateTicketsValidaiton(result)
    }
  }

  private updateDateWhenSuccess(result: InsertBetTicket14ResultModel) {
    if (result.isSuccessful) {
      this.isDisabledBetIds = true;
      this.statusInsertBetTicket14.status = 'Successfully!';
      this.statusInsertBetTicket14.isDisableButton = true;
      this.statusUpdateSummaryTicket19999.isDisableButton = false;
    } else {
      this.statusInsertBetTicket14.status = 'Failed!';
      this.statusInsertBetTicket14.isFailed = true;
    }
  }

  private updateTicketsValidaiton(result: InsertBetTicket14ResultModel) {
    this.betIdsComponent.groupNumber.updateInvalidItems(result.invalidTransIds, TEXT.INVALID_TICKETS);
    this.betIdsComponent.groupNumber.updateBeingBalanceUp(result.balanceUpTransIds, TEXT.BEING_BALANCE_UP);
  }
}
