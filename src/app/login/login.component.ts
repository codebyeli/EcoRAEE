import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from './../shared/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  public loginForm!: FormGroup;

  constructor(private fb: FormBuilder, private loginService: LoginService) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
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
    this.loginService.login(this.loginForm.value).subscribe((res) => {
    });
  }
}