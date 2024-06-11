import { Component, OnInit, Input, ViewChildren, QueryList } from '@angular/core';
import { VoidedReason } from '../../../utility/models/reason.model';
import { TemplateValue } from '../../../utility/components/template-message/template-message/template.model';
import { TemplateMessageComponent } from '../../../utility/components/template-message/template-message/template-message.component';

@Component({
  selector: 'message-area',
  templateUrl: './message-area.component.html',
  styleUrls: ['./message-area.component.scss']
})
export class MessageAreaComponent implements OnInit {
  @Input('isShowTemplateMessage') isShowTemplateMessage = false;
  @Input('totalVoidTickets') totalVoidTickets = 0;
  @Input('templateValue') templateValue = new TemplateValue();
  @Input('issueTypeId') issueTypeId: number;
  @Input('subIssueTypeId') subIssueTypeId: number;
  @Input('voidReason') voidReason: VoidedReason;
  @ViewChildren("templateMessage") templateMessageViewChildren: QueryList<TemplateMessageComponent>;
  
  constructor() { }

  ngOnInit(): void {
  }

}
