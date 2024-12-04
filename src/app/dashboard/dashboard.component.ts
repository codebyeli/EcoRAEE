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
import { MapComponent } from '../map/map.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements AfterViewInit {
  public idProfile: string | null = null;
  public error = false;
  public profile: any;
  public displayedColumns: string[] = [
    'name',
    'status',
    'date',
    'time',
    'raees',
    'appointmentCreated',
    'actions',
  ];
  public specificDisplayedColumns: string[] = [
    'status',
    'date',
    'time',
    'raees',
    'appointmentCreated',
    'actions',
  ];
  public locations: any[] = [];
  public specificappointments = new MatTableDataSource<any>([]);
  public appointments = new MatTableDataSource<any>([]);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('specificSort') specificSort!: MatSort;
  @ViewChild('specificPaginator') specificPaginator!: MatPaginator;
  @ViewChild('mapComponent') mapComponent!: MapComponent;

  private readonly SNACKBAR_DURATION = 2000;
  private readonly STATUS_PENDING = 'Pendiente de confirmacion';
  private readonly STATUS_CONFIRMED = 'Confirmada';
  private readonly STATUS_CANCELLED = 'Cancelada';

  constructor(
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private loginService: LoginService,
    private snackBar: MatSnackBar,
    private appointmentsService: AppointmentsService,
    private cdr: ChangeDetectorRef
  ) {
    this.idProfile = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.idProfile) {
      this.loadData(this.idProfile);
    }
  }

  ngAfterViewInit() {
    this.initializeTableSortingAndPagination();
  }

  private loadData(idProfile: string): void {
    forkJoin({
      profile: this.loginService.getProfile(idProfile).pipe(
        catchError(error => {
          this.error = true;
          console.error('Error loading profile:', error);
          return of(null);
        })
      ),
      specificAppointments: this.appointmentsService.getAppointmentsByProfile(idProfile).pipe(
        catchError(error => {
          console.error('Error loading specific appointments:', error);
          return of([]);
        })
      ),
      appointments: this.appointmentsService.getAppointments().pipe(
        catchError(error => {
          console.error('Error loading appointments:', error);
          return of([]);
        })
      ),
    }).subscribe(({ profile, specificAppointments, appointments }) => {
      if (profile) {
        this.profile = profile;
      }
      this.setupSpecificAppointments(specificAppointments);
      this.setupAppointments(appointments);
    });
  }

  private setupSpecificAppointments(specificAppointments: any[]): void {
    const visibleSpecificAppointments = specificAppointments.filter(appointment => appointment.confirmed !== false);
    this.specificappointments = new MatTableDataSource<any>(visibleSpecificAppointments);
    this.specificappointments.sort = this.specificSort;
    this.specificappointments.paginator = this.specificPaginator;
    this.specificappointments.sortingDataAccessor = this.sortingDataAccessor.bind(this);
  }

  private setupAppointments(appointments: any[]): void {
    this.locations = appointments.map(appointment => ({
      _id: appointment._id,
      latitude: appointment.latitude,
      longitude: appointment.longitude,
      confirmed: appointment.confirmed,
      description: `Cita con ${appointment.profileInfo.name} ${appointment.profileInfo.lastName} el ${appointment.date} a las ${appointment.time} para buscar los siguientes residuos: ${appointment.description}`,
    }));
    this.appointments = new MatTableDataSource<any>(appointments);
    this.appointments.sort = this.sort;
    this.appointments.paginator = this.paginator;
    this.appointments.sortingDataAccessor = this.sortingDataAccessor.bind(this);
  }

  private sortingDataAccessor(item: any, property: string): any {
    switch (property) {
      case 'name':
        return `${item.profileInfo.name} ${item.profileInfo.lastName}`;
      case 'status':
        return this.translateStatus(item.confirmed);
      case 'appointmentCreated':
        return new Date(item.createdAt);
      default:
        return item[property];
    }
  }

  private initializeTableSortingAndPagination(): void {
    if (this.appointments) {
      this.appointments.sort = this.sort;
      this.appointments.paginator = this.paginator;
    }
    if (this.specificappointments) {
      this.specificappointments.sort = this.specificSort;
      this.specificappointments.paginator = this.specificPaginator;
    }
  }

  openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: this.SNACKBAR_DURATION,
    });
  }

  openAppointmentsDialog(): void {
    this.dialog.open(AppointmentsComponent, {
      width: '600px',
      data: this.profile
    });
  }

  translateStatus(status: any): string {
    if (status === undefined) {
      return this.STATUS_PENDING;
    }
    return status ? this.STATUS_CONFIRMED : this.STATUS_CANCELLED;
  }
  
  cancelAppointment(id: string): void {
    this.appointmentsService.cancelAppointment(id, this.profile.email).subscribe(() => {
      this.openSnackBar('Cita cancelada', 'Cerrar');
      this.updateAppointmentStatus(id, false);
    });
  }
  
  confirmAppointment(id: string): void {
    this.appointmentsService.confirmAppointment(id).subscribe(() => {
      this.openSnackBar('Cita confirmada', 'Cerrar');
      this.updateAppointmentStatus(id, true);
    });
  }
  
  private updateAppointmentStatus(id: string, status: boolean): void {
    const appointment = this.appointments.data.find(appointment => appointment._id === id);
    if (appointment) {
      appointment.confirmed = status;
    }
    const specificAppointment = this.specificappointments.data.find(appointment => appointment._id === id);
    if (specificAppointment) {
      specificAppointment.confirmed = status;
    }
    if (!status) {
      this.specificappointments.data = this.specificappointments.data.filter(appointment => appointment.confirmed !== false);
    }
    this.updateLocations();
    this.cdr.detectChanges();
  }
  
  private updateLocations(): void {
    this.locations = this.appointments.data.map(appointment => ({
      _id: appointment._id,
      latitude: appointment.latitude,
      longitude: appointment.longitude,
      confirmed: appointment.confirmed,
      description: `Cita con ${appointment.profileInfo.name} ${appointment.profileInfo.lastName} el ${appointment.date} a las ${appointment.time} para buscar los siguientes residuos: ${appointment.description}`,
    }));
    this.updateMapMarkers();
    this.cdr.detectChanges();
  }

  private updateMapMarkers(): void {
    if (this.mapComponent) {
      this.mapComponent.updateLocations(this.locations);
    } else {
      console.error('Map component reference not found');
    }
  }


  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLSelectElement).value;
    this.appointments.filterPredicate = (data, filter) => {
      const status = this.translateStatus(data.confirmed);
      return filter === 'all' || status === filter;
    };

    switch (filterValue) {
      case 'all':
        this.appointments.filter = '';
        break;
      case 'confirmed':
        this.appointments.filter = this.STATUS_CONFIRMED;
        break;
      case 'cancelled':
        this.appointments.filter = this.STATUS_CANCELLED;
        break;
      case 'awaiting':
        this.appointments.filter = this.STATUS_PENDING;
        break;
    }
    this.updateLocations(); 
  }
}