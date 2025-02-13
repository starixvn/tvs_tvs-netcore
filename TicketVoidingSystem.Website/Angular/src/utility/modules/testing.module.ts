import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [CommonModule],
  providers: [provideHttpClient()]
})
export class TestingModule {}
