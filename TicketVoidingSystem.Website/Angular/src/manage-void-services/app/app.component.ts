import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { ScanningAutoVoidComponent } from './scanning-auto-void/scanning-auto-void.component';
import { VoidingHistoryComponent } from './voiding-history/voiding-history.component';
import { VoidComponent } from './void/void.component';
import { AfterVoidComponent } from './after-void/after-void.component';
import { LetsTalkComponent } from './letstalk/letstalk.component';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [CommonModule, NgbNavModule, ScanningAutoVoidComponent, VoidingHistoryComponent,
    VoidComponent, AfterVoidComponent, LetsTalkComponent]
})
export class AppComponent {
  title = 'Manage Void Services';
  active = 1;
}
