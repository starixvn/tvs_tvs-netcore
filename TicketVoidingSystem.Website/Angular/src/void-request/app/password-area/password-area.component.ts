import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonPrimitiveProperty } from '../models/common-primitive-property.model';

@Component({
  selector: 'password-area',
  templateUrl: './password-area.component.html',
  styleUrls: ['./password-area.component.scss']
})
export class PasswordAreaComponent implements OnInit {
  @Input('primitiveProperty') primitiveProperty: CommonPrimitiveProperty;
  @Output() clickVoidAllEvent = new EventEmitter<boolean>();
  constructor() { }

  ngOnInit(): void {
  }

  public onClickVoidAllMatches(): void{
    this.clickVoidAllEvent.emit();
  }
}
