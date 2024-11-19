import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from './../shared/services/login.service';
import { isValidDominicanID } from '../shared/utils/utils';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  public registerForm!: FormGroup;

  constructor(private fb: FormBuilder, private loginService: LoginService) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
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
    this.registerForm.get('username')?.setValue(value, { emitEvent: false });
  }

  checkValidity(): boolean {
    let username = this.registerForm.get('username')?.valid;
    let password = this.registerForm.get('password')?.valid;
    return username! && password!;
  }

  register() {
    if (this.registerForm.valid) {
      this.loginService.register(this.registerForm.value).subscribe((res) => {
        location.href = '/dashboard' + res._id;
      });
    }
  }
}