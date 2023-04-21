import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalSearchBarComponent } from './global-search-bar.component';



@NgModule({
  declarations: [
      GlobalSearchBarComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    GlobalSearchBarComponent
  ]
})
export class GlobalSearchBarModule { }
