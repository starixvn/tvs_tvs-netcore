
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IssueTypeComponent } from './issue-type.component';
@NgModule({
    imports: [CommonModule, IssueTypeComponent],
    exports: [IssueTypeComponent],
    providers: []
})
export class IssueTypeModule {}
