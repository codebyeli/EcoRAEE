import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environments } from '../../../environments/environment';
import { Appointments } from '../interfaces/appointments.interface';
let url = environments.appointmentsApiUrl;
@Injectable({
  providedIn: 'root'
})
export class AppointmentsService {

  constructor(private httpClient: HttpClient) { }

  getAppointments():Observable<any> {
    return this.httpClient.get(`${url}/`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  getAppointmentsByProfile(id: string):Observable<any> {
    return this.httpClient.get(`${url}/appointments-by-profile/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  getConfirmedAppointments():Observable<any> {
    return this.httpClient.get(`${url}/confirmed`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  getUnconfirmedAppointments():Observable<any> {
    return this.httpClient.get(`${url}/unconfirmed`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  confirmAppointment(id: string):Observable<any> {
    return this.httpClient.post(`${url}/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  createAppointment(appointmentInfo: Appointments):Observable<any> {
    return this.httpClient.post(`${url}`, appointmentInfo, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  deleteAppointment(id: string):Observable<any> {
    return this.httpClient.delete(`${url}/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

}
