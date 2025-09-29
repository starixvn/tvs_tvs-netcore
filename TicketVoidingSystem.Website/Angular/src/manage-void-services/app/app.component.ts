import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { AfterVoidComponent } from './after-void/after-void.component';
import { CorrectSummaryTicketComponent } from "./correct-summary-ticket/correct-summary-ticket.component";
import { LetsTalkComponent } from './letstalk/letstalk.component';
import { ScanningAutoVoidComponent } from './scanning-auto-void/scanning-auto-void.component';
import { VoidComponent } from './void/void.component';
import { VoidingHistoryComponent } from './voiding-history/voiding-history.component';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [CommonModule, NgbNavModule, ScanningAutoVoidComponent, VoidingHistoryComponent,
    VoidComponent, AfterVoidComponent, LetsTalkComponent, CorrectSummaryTicketComponent]
})
export class AppComponent {
  title = 'Manage Void Services';
  active = 1;
}
