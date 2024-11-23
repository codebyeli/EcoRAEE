import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function isValidDominicanID(control: AbstractControl): ValidationErrors | null {
  const regex = /^\d{3}-\d{7}-\d{1}$/;
  const valid = regex.test(control.value);
  return valid ? null : { invalidDominicanID: true };
}

export function emailValidator(control: AbstractControl): ValidationErrors | null {
  const email = control.value; 
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/; 
  if (email && !emailPattern.test(email)) { return { invalidEmail: true }; } 
  return null
}

export function passwordValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.value; 
  if (password && password.length < 8) {
    return { invalidPassword: true }; 
  } 
  return null;
}

export function googleMapsLinkValidator(required: boolean = false): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!required && (control.value === null || control.value === '')) {
      return null;
    }

    const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;
    const isValidUrl = urlPattern.test(control.value);

    if (!isValidUrl) {
      return { invalidUrl: true };
    }

    if (control.value.includes('google.com/maps')) {
      const latLngPattern = /@(-?\d+(\.\d+)?),(-?\d+(\.\d+)?),\d+(\.\d+)?z/;
      const isValidLatLng = latLngPattern.test(control.value.split('?')[0]);

      if (isValidLatLng) {
        return null;
      }

      const qPattern = /q=(-?\d+(\.\d+)?),(-?\d+(\.\d+)?)/;
      const isValidQ = qPattern.test(control.value);

      return isValidQ ? null : { invalidLatLng: true };
    }

    return { notGoogleMapsUrl: true };
  };
}
