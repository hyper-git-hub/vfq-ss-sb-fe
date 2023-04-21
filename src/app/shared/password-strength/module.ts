import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import PasswordStrengthComponent from './password-strength.component';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [
        PasswordStrengthComponent,
    ],
    imports: [
        CommonModule
    ],
    exports: [
        PasswordStrengthComponent
    ]
})
export class PasswordStrengthModule { }
