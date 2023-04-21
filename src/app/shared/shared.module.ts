import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FunnelComponent } from './funnel/funnel.component';

import { ConfirmBoxModule } from './confirm-box/module';
import { InputMaskModule } from 'primeng/inputmask';


const primengModules = [
  InputMaskModule,
];



@NgModule({

  declarations: [],
  imports: [
    CommonModule,
    ConfirmBoxModule,
    primengModules
  ],
  exports: [
    primengModules,
  ]

})
export class SharedModule { }
