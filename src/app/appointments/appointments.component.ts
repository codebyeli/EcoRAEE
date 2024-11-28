import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import flatpickr from 'flatpickr';
import { googleMapsLinkValidator } from '../shared/utils/utils';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppointmentsService } from '../shared/services/appointments.service';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss']
})
export class AppointmentsComponent implements OnInit {
  appointmentForm: FormGroup;
  timeSlots: string[] = this.generateTimeSlots();

  constructor(private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<AppointmentsComponent>, private snackBar: MatSnackBar, private appointmentsService: AppointmentsService) {
    this.appointmentForm = this.fb.group({
      profileId: [data._id, Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      description: ['', Validators.required],
      location: ['', googleMapsLinkValidator()],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required],
      confirmed: [false],
    });
  }

  ngOnInit(): void {
    flatpickr('#date', {
      minDate: 'today',
      disable: [
        function (date) {
          return date.getDay() === 0;
        },
      ],
      dateFormat: 'd/m/Y',
    });
  }

  private generateTimeSlots(): string[] {
    const slots: string[] = [];
    for (let hour = 9; hour <= 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const hourString = hour.toString().padStart(2, '0');
        const minuteString = minute.toString().padStart(2, '0');
        slots.push(`${hourString}:${minuteString}`);
      }
    }
    return slots;
  }

 longitudeAndLatitudeFill() {
  const locationControl = this.appointmentForm.get('location');
  if (locationControl && locationControl.value) {
    const locationValue = locationControl.value;
    const regex = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
    const match = locationValue.match(regex);
    if (match) {
      const latitude = parseFloat(match[1]);
      const longitude = parseFloat(match[2]);
      this.appointmentForm.patchValue({
        latitude: latitude,
        longitude: longitude
      });
    }
  }
}

onSubmit(): void {
  if (this.appointmentForm.valid) {
    const formValue = this.appointmentForm.value;
    const { location, ...appointment } = formValue;
    this.dialogRef.close(appointment);
    this.appointmentsService.createAppointment(appointment).subscribe({
      next: () => {
        this.snackBar.open('Cita creada correctamente, esperando confirmacion...', 'Close', {
          duration: 3000,
        });
      }, error: (error) => {
        console.log(error)
      }
    })
    window.location.reload();
    this.appointmentForm.reset();
  }
}
}