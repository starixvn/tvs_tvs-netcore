
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BlockUiModule } from 'src/utility/components/block-ui/block-ui.module';
import { PipeModule } from 'src/utility/pipes/pipe.module';
import { BaseTicketsListComponent } from '../../../../../utility/components/base-tickets-list/base-tickets-list.component';
import { TicketsModel } from './tickets.model';

@Component({
    selector: 'tickets',
    templateUrl: './tickets.component.html',
    styleUrls: ['./tickets.component.scss'],
    standalone: true,
    imports: [FormsModule, BlockUiModule, PipeModule, CommonModule]
})
export class TicketsComponent extends BaseTicketsListComponent<TicketsModel> implements OnInit {
  @Input() model = new TicketsModel();
  @Input() isBlock: boolean;

  public ngOnInit() {
    this.clickBody();
  }

  isShowNoData(): boolean {
    return this.model.groups === undefined ||
      this.model.groups.length === 0 ||
      this.model.groups === null ||
      this.model.groups.every(group => group.displayTotalTickets === 0);
  }
}