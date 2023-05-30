import { MatchModel } from '../../../../utility/models/match.model';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'match-info',
  templateUrl: './match-info.component.html',
  styleUrls: ['./match-info.component.scss']
})
export class MatchInfoComponent implements OnInit {
  @Input() match = new MatchModel();
  constructor() { }

  ngOnInit() {
  }

}
