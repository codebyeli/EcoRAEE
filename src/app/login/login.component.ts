import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from './../shared/services/login.service';
import { isValidDominicanID } from '../shared/utils/utils';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  public loginForm!: FormGroup;
  public attemptedSubmit = false;

  constructor(private fb: FormBuilder, private loginService: LoginService, private _snackBar: MatSnackBar) {}

  openSnackBar(message: string, action: string){
    this._snackBar.open(message, action, {
      duration: 2000,
    })
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, isValidDominicanID]],
      password: ['', Validators.required]
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
    this.loginForm.get('username')?.setValue(value, { emitEvent: false });
  }

  checkValidity() : boolean{
    let username = this.loginForm.get('username')?.valid;
    let password = this.loginForm.get('password')?.valid;
    if(username && password){
      return true
    } else {
      return false
    }
  }

  login() {
    this.attemptedSubmit = true;
    if (this.loginForm.valid) {
      this.loginService.login(this.loginForm.value).subscribe((res) => {
        if (res === false){
          this.openSnackBar('Credenciales incorrectas', 'Cerrar')
        }
        else if (res._id){
          location.href = '/EcoRAEE/dashboard/' + res._id
        }
      });
    }
  }
}