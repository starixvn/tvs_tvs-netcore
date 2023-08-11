import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ToastrModule } from 'ngx-toastr';
import { UtilityModule } from 'src/utility/utility.module';
import { AddRequestModule } from './add-request/add-request.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    AddRequestModule,
    ToastrModule.forRoot(),
    UtilityModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
