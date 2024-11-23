import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppointmentsComponent } from '../appointments/appointments.component';
import { ActivatedRoute } from '@angular/router';
import { LoginService } from '../shared/services/login.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  public idProfile: string | null = null;
  public error: boolean = false;
  public profile: any;

  constructor(private dialog: MatDialog, private activatedRoute: ActivatedRoute, private loginService : LoginService, private _snackBar: MatSnackBar) {
    this.idProfile = this.activatedRoute.snapshot.paramMap.get('id');
    if(this.idProfile){
      this.loginService.getProfile(this.idProfile).subscribe((profile) => {
        this.profile = profile;
      }, error => {
        this.error = true;
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
}