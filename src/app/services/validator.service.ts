import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidatorService {

  form: FormGroup | null;
  constructor() { 
    this.form = null;
  }

  public setForm(form: FormGroup): void {
    this.form = form;
  }

  validateRequired(control: string): string {
    if (this.form?.get(control)?.hasError('required')) {
      return 'You must enter a value!';
    }
    return '';
  }

  validateNumberRange(control: string, minValue: number, maxValue: number): string {
    if (this.form?.get(control)?.hasError('required')) {
      return 'You must enter a value!';
    }
    if (this.form?.get(control)?.hasError('min')) {
      return `You must enter a value greater or equal to ${minValue}!`;
    }
    if (this.form?.get(control)?.hasError('max')) {
      return `You must enter a value less or equal to ${maxValue}!`;
    }
    return '';
  }

  validateEmail(control: string): string {
    if (this.form?.get(control)?.hasError('required')) {
      return 'You must enter a value!';
    }
    if (this.form?.get(control)?.hasError('email')) {
      return 'Not valid email address!';
    }
    return '';
  }

  validatePhoneNumber(control: string): string {
    if (this.form?.get(control)?.hasError('required')) {
      return 'You must enter a value!';
    }
    if (this.form?.get(control)?.hasError('pattern')) {
      return 'Enter 10 digits!';
    }
    return '';
  }

  validateFourDigits(control: string): string {
    if (this.form?.get(control)?.errors != null) {
      return 'Required 4 digits exactly!';
    }
    return '';
  }

  validate3To30(control: string): string {
    if (this.form?.get(control)?.errors != null) {
      return 'Required length is 3 - 30!';
    }
    return '';
  }

  /**
   * Compare data model and form.
   * @param model 
   * @returns boolean? true - If model is not changed, otherwise false - if model is changed
   */
  compareIfModelChanged(model: any): boolean {
    let value: boolean = true;
    if (this.form != null) {
      Object.keys(this.form.controls)?.forEach(control => {
        if (this.form?.get(control)?.value !== model[control]) {
          value = false;
        }
      });
    }
    return value;
  }
}
