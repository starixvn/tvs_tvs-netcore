import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BlockUiModule } from 'src/utility/components/block-ui/block-ui.module';
import { PagingModule } from 'src/utility/components/paging/paging.module';
import { PipeModule } from 'src/utility/pipes/pipe.module';
import { TableTicketsModel } from './table-tickets.model';

@Component({
  selector: 'tickets-list',
  templateUrl: './tickets-list.component.html',
  styleUrls: ['./tickets-list.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule, NgbModule, BlockUiModule, PipeModule, PagingModule]
})
export class TicketsListComponent {
  @Input() model: TableTicketsModel;
  @Input() isBlock: boolean;
}
