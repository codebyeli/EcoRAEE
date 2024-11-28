import { ChangeDetectorRef, Component } from '@angular/core';
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
    'name',
    'status',
    'date',
    'time',
    'appointmentCreated',
    'actions',
  ];
  public specificDisplayedColumns: string[] = [
    'status',
    'date',
    'time',
    'appointmentCreated',
    'actions',
  ];
  public specificappointments: any
  public appointments: any


  constructor(private dialog: MatDialog, private activatedRoute: ActivatedRoute, private loginService : LoginService, private _snackBar: MatSnackBar, private appointmentsService: AppointmentsService, private cdr: ChangeDetectorRef) {
    this.idProfile = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.idProfile) {
      forkJoin({
        profile: this.loginService.getProfile(this.idProfile).pipe(
          catchError(error => {
            this.error = true;
            return of(null);
          })
        ),
        specificAppointments: this.appointmentsService.getAppointmentsByProfile(this.idProfile).pipe(
          catchError(error => {
            console.error(error);
            return of([]); 
          })
        ),
        appointments: this.appointmentsService.getAppointments().pipe(
          catchError(error => {
            console.error(error);
            return of([]); 
          })
        ),
      }).subscribe(({ profile, specificAppointments, appointments }) => {
        if (profile) {
          this.profile = profile;
        }
        this.specificappointments = specificAppointments;
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

  deleteAppointment(id: string) {
    this.appointmentsService.deleteAppointment(id).subscribe(() => {
      this.openSnackBar('Cita eliminada', 'Cerrar');
      this.specificappointments = this.specificappointments.filter((appointment:any) => appointment._id !== id);
      this.appointments = this.appointments.filter((appointment:any) => appointment._id !== id);
      this.cdr.detectChanges();
    });
  }
  
  confirmAppointment(id: string) {
    this.appointmentsService.confirmAppointment(id).subscribe(() => {
      this.openSnackBar('Cita confirmada', 'Cerrar');
      const appointment = this.appointments.find((appointment:any) => appointment._id === id);
      if (appointment) {
        appointment.confirmed = true;
      }
      const specificAppointment = this.specificappointments.find((appointment:any) => appointment._id === id);
      if (specificAppointment) {
        specificAppointment.confirmed = true;
      }
      this.cdr.detectChanges();
    });
  }
}