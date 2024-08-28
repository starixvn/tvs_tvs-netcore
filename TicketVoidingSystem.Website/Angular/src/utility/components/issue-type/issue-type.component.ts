import { Component, Input } from '@angular/core';

@Component({
  selector: 'issue-type',
  templateUrl: './issue-type.component.html',
  styleUrls: ['./issue-type.component.scss']
})
export class IssueTypeComponent {
  @Input() issueTypeName: string;
  @Input() isShowVar: boolean;
}
