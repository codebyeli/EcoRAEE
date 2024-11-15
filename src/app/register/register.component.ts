import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from './../shared/services/login.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  public registerForm!: FormGroup;

  constructor(private fb: FormBuilder, private loginService: LoginService) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  checkValidity() : boolean{
    let username = this.registerForm.get('username')?.valid;
    let password = this.registerForm.get('password')?.valid;
    if(username && password){
      return true
    } else {
      return false
    }
  }

  register() {
    this.loginService.login(this.registerForm.value).subscribe((res) => {
    });
  }
}