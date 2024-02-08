import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-test-errors',
  templateUrl: './test-errors.component.html',
  styleUrls: ['./test-errors.component.css']
})
export class TestErrorsComponent implements OnInit {
  baseUrl = environment.apiURL;
  validationErrors: string[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  get404Error() {
    this.http.get(`${this.baseUrl}buggy/not-found`).subscribe({
      next: (response) => console.log(response),
      error: (error) => console.log(error)
    });
  }

  get400Error() {
    this.http.get(`${this.baseUrl}buggy/bad-request`).subscribe({
      next: (response) => console.log(response),
      error: (error) => console.log(error)
    });
  }

  get500Error() {
    this.http.get(`${this.baseUrl}buggy/server-error`).subscribe({
      next: (response) => console.log(response),
      error: (error) => console.log(error)
    });
  }

  get401Error() {
    this.http.get(`${this.baseUrl}buggy/auth`).subscribe({
      next: (response) => console.log(response),
      error: (error) => console.log(error)
    });
  }

  get400ValidationError() {
    this.http.post(`${this.baseUrl}account/register`, {}).subscribe({
      next: (response) => console.log(response),
      error: (error: HttpErrorResponse) => {
        console.log(error);
        if (error.status === 400 && error.error.errors) {
          // Assuming the API returns validation errors in a property named errors
          this.validationErrors = this.flattenValidationErrors(error.error.errors);
        } else {
          this.validationErrors = ['An unexpected error occurred.'];
        }
      }
    });
  }

  private flattenValidationErrors(errors: any): string[] {
    let validationErrors: string[] = [];
    Object.keys(errors).forEach(key => {
      if (errors[key]) {
        validationErrors = validationErrors.concat(errors[key]);
      }
    });
    return validationErrors;
  }
}
