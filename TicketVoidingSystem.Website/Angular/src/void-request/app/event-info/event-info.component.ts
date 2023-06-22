import { Component, OnInit, Input } from '@angular/core';
import { MatchModel } from '../../../utility/models/match.model';

@Component({
  selector: 'event-info',
  templateUrl: './event-info.component.html',
  styleUrls: ['./event-info.component.scss']
})
export class EventInfoComponent {
  @Input() match = new MatchModel();
}
