import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environments } from '../../../environments/environment';
import { Login } from '../interfaces/login.interface';
import { Profile } from '../interfaces/profile.interface';
let url = environments.loginApiUrl;
@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private httpClient: HttpClient) { }

  login(loginInfo: Login):Observable<any> {
    return this.httpClient.post(`${url}/userAccess`, loginInfo, {
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
