import { Component, Input} from '@angular/core';
import { LinkedLogsViewModel } from './linked-log.model';

@Component({
    selector: 'linked-log',
    templateUrl: './linked-log.component.html',
    styleUrls: ['./linked-log.component.scss'],
    standalone: true
})
export class LinkedLogComponent {
  @Input() linkedLogsViewModel = new LinkedLogsViewModel();
}
