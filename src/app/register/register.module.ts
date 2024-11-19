import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';  // Import ReactiveFormsModule
import { RegisterComponent } from './register.component';
import { RegisterRoutingModule } from './register-routing.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';


@NgModule({
  declarations: [
    RegisterComponent
  ],
  imports: [
    CommonModule,
    RegisterRoutingModule,
    ReactiveFormsModule,
    MatSnackBarModule
  ]
})
export class RegisterModule { }
