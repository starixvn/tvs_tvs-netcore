import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgbModalConfig, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ClipboardModule } from 'ngx-clipboard';
import { PipeModule } from '../../pipes/pipe.module';
import { ModalContentComponent } from './modal-content/modal-content.component';
import { ModalService } from './modal.service';

@NgModule({
    imports: [ClipboardModule, CommonModule, NgbModalModule, PipeModule, ModalContentComponent],
    exports: [ModalContentComponent],
    providers: [ModalService, NgbModalConfig]
})
export class ModalModule {}
