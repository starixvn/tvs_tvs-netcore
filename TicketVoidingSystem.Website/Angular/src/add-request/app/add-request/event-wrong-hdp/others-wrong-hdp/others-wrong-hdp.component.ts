import { Component, Input } from '@angular/core';
import { OthersModel } from '../../others/others.model';

@Component({
  selector: 'others-wrong-hdp',
  templateUrl: './others-wrong-hdp.component.html',
  styleUrls: ['./others-wrong-hdp.component.scss']
})
export class OthersWrongHdpComponent {
  @Input() isEdit: boolean;
  @Input() model = new OthersModel();
  
  isCollapse: boolean;

}
