import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagingComponent } from './paging/paging.component';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbPaginationModule
  ],
  declarations: [
    PagingComponent
  ],
  exports: [
    PagingComponent
  ]
})
export class PagingModule { }
