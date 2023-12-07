import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'sorting',
  templateUrl: './sorting.component.html',
  styleUrls: ['./sorting.component.scss']
})
export class SortingComponent {
  @Input() id: number;
  @Output() sortEvent = new EventEmitter<boolean>();
  isDesc: boolean = null;

  clickEvent(): void {
    this.isDesc =  !this.isDesc;
    this.sortEvent.emit(this.isDesc);
  }
}
