import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PagingModel } from './paging.model';
import { CommonModule } from '@angular/common';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'paging',
  templateUrl: './paging.component.html',
  styleUrls: ['./paging.component.scss'],
  imports: [ CommonModule, FormsModule, NgbPaginationModule ]
})
export class PagingComponent {
  @Input() model = new PagingModel();
  @Output() modelChange = new EventEmitter<PagingModel>();

  changePageSize() {
    this.model.page = 1;
    this.modelChange.emit(this.model);
  }

  pageChange() {
    this.modelChange.emit(this.model);
  }
}
