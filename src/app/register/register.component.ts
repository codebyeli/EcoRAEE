import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from './../shared/services/login.service';
import { emailValidator, isValidDominicanID, passwordValidator } from '../shared/utils/utils';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  public registerForm!: FormGroup;

  constructor(private fb: FormBuilder, private loginService: LoginService, private _snackBar: MatSnackBar) {}

  openSnackBar(message: string, action: string){
    this._snackBar.open(message, action, {
      duration: 2000,
    })
  }

  ngOnInit() {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, emailValidator]],
      birthday: ['', Validators.required],
      username: ['', [Validators.required, isValidDominicanID]],
      password: ['', [Validators.required, passwordValidator]]
    });
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
    this.registerForm.get('username')?.setValue(value, { emitEvent: false });
  }

  checkValidity(): boolean {
    let name = this.registerForm.get('name')?.valid;
    let lastName = this.registerForm.get('lastName')?.valid;
    let email = this.registerForm.get('email')?.valid;
    let birthday = this.registerForm.get('birthday')?.valid;
    let username = this.registerForm.get('username')?.valid;
    let password = this.registerForm.get('password')?.valid;
    return name! && lastName! && email! && birthday! && username! && password!;
  }

  register() {
    if (this.registerForm.valid) {
      this.loginService.register(this.registerForm.value).subscribe((res) => {
        location.href = '/dashboard' + res._id;
      }, error => {
          this.openSnackBar('Esta cédula ya está registrada', 'Cerrar')
      });
    }
  }
}