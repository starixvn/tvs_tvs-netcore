import { Component, Input } from '@angular/core';
import { OthersModel } from '../../others/others.model';

@Component({
  selector: 'abnormal-accounts-other',
  templateUrl: './abnormal-accounts-other.component.html',
  styleUrls: ['./abnormal-accounts-other.component.scss']
})
export class AbnormalAccountOtherComponent {
  @Input() isEdit: boolean;
  @Input() model = new OthersModel();
  isCollapse: boolean;
}
