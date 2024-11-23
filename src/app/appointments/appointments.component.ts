import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import flatpickr from 'flatpickr';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss']
})
export class AppointmentsComponent implements OnInit {
  appointmentForm: FormGroup;
  timeSlots: string[] = this.generateTimeSlots();
  durations: number[] = [15, 30, 45, 60, 90, 120];

  constructor(private fb: FormBuilder) {
    this.appointmentForm = this.fb.group({
      profileId: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      description: [''],
      locationId:  ['', Validators.required],
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
  

  onSubmit(): void {
    if (this.appointmentForm.valid) {
      const formValue = this.appointmentForm.value;
      const appointment = {
        ...formValue,
      };
      this.appointmentForm.reset();
    }
  }
}