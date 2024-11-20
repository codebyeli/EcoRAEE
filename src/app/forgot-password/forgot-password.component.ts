import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginService } from '../shared/services/login.service';
import { emailValidator, isValidDominicanID, passwordValidator } from '../shared/utils/utils';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  public forgotPasswordForm!: FormGroup;
  public attemptedSubmit = false;
  passwordFieldType: string = 'password';
  confirmPasswordFieldType: string = 'password';

  constructor(private fb: FormBuilder, private loginService: LoginService, private _snackBar: MatSnackBar) {}

  openSnackBar(message: string, action: string){
    this._snackBar.open(message, action, {
      duration: 2000,
    })
  }

  formatID(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/-/g, '');
    if (value.length > 3) {
      value = value.slice(0, 3) + '-' + value.slice(3);
    }
    if (value.length > 11) {
      value = value.slice(0, 11) + '-' + value.slice(11, 12);
    }
    input.value = value;
    this.forgotPasswordForm.get('username')?.setValue(value, { emitEvent: false });
  }

  ngOnInit() {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, emailValidator]],
      username: ['', [Validators.required, isValidDominicanID]],
      newPassword: ['', [Validators.required, passwordValidator]],
      confirmPassword: ['', [Validators.required, passwordValidator]]
    });
  }

  checkValidity() : boolean {
    let email = this.forgotPasswordForm.get('email')?.valid;
    let username = this.forgotPasswordForm.get('username')?.valid;
    let passwordValid = this.forgotPasswordForm.get('newPassword')?.valid;
    let confirmPasswordValid = this.forgotPasswordForm.get('confirmPassword')?.valid;
    let password = this.forgotPasswordForm.get('newPassword')?.value;
    let confirmPassword = this.forgotPasswordForm.get('confirmPassword')?.value;

    if (username && email && passwordValid && confirmPasswordValid && password === confirmPassword) {
        return true;
    } else {
        return false;
    }
}

togglePasswordVisibility() {
  this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
}

toggleConfirmPasswordVisibility() {
  this.confirmPasswordFieldType = this.confirmPasswordFieldType === 'password' ? 'text' : 'password';
}

  recoverPassword() {
    this.attemptedSubmit = true;
    if (this.checkValidity()) {
      let username = this.forgotPasswordForm.get('username')?.value;
      let email = this.forgotPasswordForm.get('email')?.value;
      let password = this.forgotPasswordForm.get('newPassword')?.value;
      let forgotPasswordInfo = { email, username, password };
      this.loginService.changePassword(forgotPasswordInfo).subscribe((res) => {
        if (res === false){
          this.openSnackBar('La cédula no coincide con el correo electronico', 'Cerrar')
        }
        else {
          this.openSnackBar('El cambio de contraseña ha sido efectuado', 'Cerrar')
          location.href = '/login';
        }
      });
    }
  }
}
