import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { TemplateMessageComponent } from '../../../utility/components/template-message/template-message/template-message.component';
import { TemplateValue } from '../../../utility/components/template-message/template-message/template.model';
import { VoidedReason } from '../../../utility/models/reason.model';
import { VoidReasonComponent } from './void-reason/void-reason.component';

@Component({
  selector: 'message-area',
  templateUrl: './message-area.component.html',
  styleUrls: ['./message-area.component.scss']
})
export class MessageAreaComponent implements OnInit {
  @Input() requestId: number;
  @Input('isShowTemplateMessage') isShowTemplateMessage = false;
  @Input('totalVoidTickets') totalVoidTickets = 0;
  @Input('templateValue') templateValue = new TemplateValue();
  @Input('issueTypeId') issueTypeId: number;
  @Input('subIssueTypeId') subIssueTypeId: number;
  @Input('voidReason') voidReason: VoidedReason;
  @ViewChild("templateMessage") templateMessageComponent: TemplateMessageComponent;
  @ViewChild("reason") reasonComponent: VoidReasonComponent;
  constructor() { }

  ngOnInit(): void {
  }
}
