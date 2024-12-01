import { ChangeDetectorRef, Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppointmentsComponent } from '../appointments/appointments.component';
import { ActivatedRoute } from '@angular/router';
import { LoginService } from '../shared/services/login.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppointmentsService } from './../shared/services/appointments.service';
import { forkJoin, catchError, of } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements AfterViewInit {
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
  public locations: any[] = [];
  public specificappointments: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  public appointments: MatTableDataSource<any> = new MatTableDataSource<any>([]);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('specificSort') specificSort!: MatSort;
  @ViewChild('specificPaginator') specificPaginator!: MatPaginator;

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
        this.specificappointments = new MatTableDataSource<any>(specificAppointments);
        this.specificappointments.sort = this.specificSort;
        this.specificappointments.paginator = this.specificPaginator;
        this.specificappointments.sortingDataAccessor = (item, property) => {
          switch (property) {
            case 'name': return item.profileInfo.name + ' ' + item.profileInfo.lastName;
            case 'status': return this.translateStatus(item.confirmed);
            case 'appointmentCreated': return new Date(item.createdAt);
            default: return item[property];
          }
        };
        this.locations = appointments.map((appointment: any) => ({
          _id: appointment._id,
          latitude: appointment.latitude,
          longitude: appointment.longitude,
          description: 'Cita con ' + appointment.profileInfo.name + ' ' + appointment.profileInfo.lastName + ' el ' + appointment.date + ' a las ' + appointment.time + ' para buscar los siguientes residuos: ' + appointment.description,
        }));
        this.appointments = new MatTableDataSource<any>(appointments);
        this.appointments.sort = this.sort;
        this.appointments.paginator = this.paginator;
        this.appointments.sortingDataAccessor = (item, property) => {
          switch (property) {
            case 'name': return item.profileInfo.name + ' ' + item.profileInfo.lastName;
            case 'status': return this.translateStatus(item.confirmed);
            case 'appointmentCreated': return new Date(item.createdAt);
            default: return item[property];
          }
        };
      });
    }
  }

  ngAfterViewInit() {
    if (this.appointments) {
      this.appointments.sort = this.sort;
      this.appointments.paginator = this.paginator;
    }
    if (this.specificappointments) {
      this.specificappointments.sort = this.specificSort;
      this.specificappointments.paginator = this.specificPaginator;
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

  translateStatus(status: any): string {
    if (status === undefined) {
      return 'Pendiente de confirmacion';
    }
    return status ? 'Confirmada' : 'Cancelada';
  }

  cancelAppointment(id: string) {
    this.appointmentsService.cancelAppointment(id, this.profile.email).subscribe(() => {
      this.openSnackBar('Cita cancelada', 'Cerrar');
      const appointment = this.appointments.data.find((appointment: any) => appointment._id === id);
      if (appointment) {
        appointment.confirmed = false;
      }
      const specificAppointment = this.specificappointments.data.find((appointment: any) => appointment._id === id);
      if (specificAppointment) {
        specificAppointment.confirmed = false;
      }
      this.cdr.detectChanges();
    });
  }
  
  confirmAppointment(id: string) {
    this.appointmentsService.confirmAppointment(id).subscribe(() => {
      this.openSnackBar('Cita confirmada', 'Cerrar');
      const appointment = this.appointments.data.find((appointment: any) => appointment._id === id);
      if (appointment) {
        appointment.confirmed = true;
      }
      const specificAppointment = this.specificappointments.data.find((appointment: any) => appointment._id === id);
      if (specificAppointment) {
        specificAppointment.confirmed = true;
      }
      this.cdr.detectChanges();
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLSelectElement).value;
    this.appointments.filterPredicate = (data: any, filter: string) => {
      const status = this.translateStatus(data.confirmed);
      return filter === 'all' || status === filter;
    };
  
    if (filterValue === 'all') {
      this.appointments.filter = '';
    } else if (filterValue === 'confirmed') {
      this.appointments.filter = 'Confirmada';
    } else if (filterValue === 'cancelled') {
      this.appointments.filter = 'Cancelada';
    } else if (filterValue === 'awaiting') {
      this.appointments.filter = 'Pendiente de confirmacion';
    }
  }
}