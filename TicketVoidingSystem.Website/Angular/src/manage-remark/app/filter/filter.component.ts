import { Component, ElementRef, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FilterModel } from '../models/filter.model';
import { NgbDate, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { MultipleSelectionComponent } from '../../../utility/components/multiple-selection/multiple-selection.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { TooltipComponent } from '../../../utility/components/tooltip/tooltip.component';
import { Tooltip } from '../../../utility/components/tooltip/tooltip.model';
import { FilterService } from './filter.service';
import { OnlyNumberDirective } from '../../../utility/directives/number.directive';

@Component({
  standalone: true,
  selector: 'filter',
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss',
  imports: [FormsModule, NgbDatepickerModule, MultipleSelectionComponent, NgSelectModule, TooltipComponent, OnlyNumberDirective]
})
export class FilterComponent implements OnInit {
  @Input() model: FilterModel;
  @Input() minDate: NgbDate;
  @Output() openAddRemark = new EventEmitter<void>();

  tooltip = new Tooltip();

  element = inject(ElementRef);
  filterService = inject(FilterService);
  
  constructor() {
    this.tooltip.element = this.element;
  }

  ngOnInit(): void {
    this.filterService.initDefaultFilter(this.model);
  }

  isFilterByMatch(): boolean {
    return this.model.searchBy === '0';
  }

  updateSelectedAction(selectedItems: string[]): void {
    this.model.action = selectedItems.join(',');
  }

  changeSearchBy() {
    this.model.remarkId = null;
    this.model.matchId = null;
  }


  clickSearch() { 
    if(this.filterService.inValidFilter(this.model, this.tooltip)) {
      return;
    }
  }

  newRemark() { 
    this.openAddRemark.emit();
  }

  updateModel() { }
}
