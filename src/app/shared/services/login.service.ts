import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environments } from '../../../environments/environment';
import { Login } from '../interfaces/login.interface';
import { Profile } from '../interfaces/profile.interface';
import { ForgotPasswordInfo } from '../interfaces/forgot-password.interface';
let url = environments.loginApiUrl;
@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private httpClient: HttpClient) { }

  getProfile(profileId: string):Observable<any> {
    return this.httpClient.get(`${url}/${profileId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  login(loginInfo: Login):Observable<any> {
    return this.httpClient.post(`${url}/access`, loginInfo, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  changePassword(loginInfo: ForgotPasswordInfo):Observable<any> {
    return this.httpClient.post(`${url}/forgot-password`, loginInfo, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  register(profileInfo: Profile):Observable<any> {
    return this.httpClient.post(`${url}`, profileInfo, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}
