import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppointmentsComponent } from '../appointments/appointments.component';
import { ActivatedRoute } from '@angular/router';
import { LoginService } from '../shared/services/login.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppointmentsService } from './../shared/services/appointments.service';
import { forkJoin, catchError, of } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  public idProfile: string | null = null;
  public error: boolean = false;
  public profile: any;
  public displayedColumns: string[] = [
    'status',
    'date',
    'time',
    'appointmentCreated',
    'actions',
  ];
  public appointments: any

  constructor(private dialog: MatDialog, private activatedRoute: ActivatedRoute, private loginService : LoginService, private _snackBar: MatSnackBar, private appointmentsService: AppointmentsService) {
    this.idProfile = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.idProfile) {
      forkJoin({
        profile: this.loginService.getProfile(this.idProfile).pipe(
          catchError(error => {
            this.error = true;
            return of(null);
          })
        ),
        appointments: this.appointmentsService.getAppointmentsByProfile(this.idProfile).pipe(
          catchError(error => {
            console.error(error);
            return of([]); 
          })
        )
      }).subscribe(({ profile, appointments }) => {
        if (profile) {
          this.profile = profile;
        }
        this.appointments = appointments;
      });
    }
  }

  openSnackBar(message: string, action: string){
    this._snackBar.open(message, action, {
      duration: 2000,
    })
  }

  openAppointmentsDialog(): void {
    this.dialog.open(AppointmentsComponent, {
      width: '600px',
      data: this.profile
    });
  }

  translateStatus(status: boolean) : string {
    return status ? 'Confirmada' : 'En proceso de confirmación';
  }

  deleteAppointment(id:string){
    this.appointmentsService.deleteAppointment(id).subscribe(() => {
      this.openSnackBar('Cita eliminada', 'Cerrar');
    });
    window.location.reload();
  }
}