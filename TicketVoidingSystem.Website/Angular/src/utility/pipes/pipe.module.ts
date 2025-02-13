import { SanitizeHtmlPipe } from './sanitize-html.pipe';

import { NgModule } from '@angular/core';

@NgModule({
    imports: [SanitizeHtmlPipe],
    declarations: [],
    exports: [SanitizeHtmlPipe],
    providers: []
})
export class PipeModule {}
