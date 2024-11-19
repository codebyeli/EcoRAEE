import { AbstractControl, ValidationErrors } from '@angular/forms';

export function isValidDominicanID(control: AbstractControl): ValidationErrors | null {
  const regex = /^\d{3}-\d{7}-\d{1}$/;
  const valid = regex.test(control.value);
  return valid ? null : { invalidDominicanID: true };
}