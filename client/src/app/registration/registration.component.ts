import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter();
  model: any = {};
  registrationCompleted = false;
  registerForm: UntypedFormGroup; 
  presentationCheckboxChecked = false;
  siteKey: string;
  isLoading = false;

  constructor(
    private accountService: AccountService, 
    private toastr: ToastrService,
    private formBuilder: UntypedFormBuilder,
  ) { 
    this.siteKey = '6Ldx0mEpAAAAAEYeb1lnfYgHQeUc3FitRJ7x1p_G';
    this.accountService.registrationCompleted$.subscribe((completed) => {
      this.registrationCompleted = completed;
    });
    this.registrationCompleted = false;
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      secondName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      emailAddress: ['', [Validators.required, Validators.email]],
      university: ['', [Validators.required]],
      presentation: [{value: '', disabled: true}, [Validators.minLength(2), Validators.maxLength(200)]],
      recaptchaReactive: [null, Validators.required]  // Add this line
    });
  }

  register() {
    if (this.registerForm.valid) {
      this.isLoading = true; 
      this.accountService.register(this.registerForm.value).subscribe(
        response => {
          console.log(response);
          this.registrationCompleted = true; 
          this.isLoading = false; 
        }, 
        error => {
          console.log(error);
          this.toastr.error(error.error);
          this.isLoading = false; 
        }
      );
    } else {
      this.toastr.error('Form is not valid!');
    }
  }



  togglePresentationField() {
    this.presentationCheckboxChecked = !this.presentationCheckboxChecked;
    if (this.presentationCheckboxChecked) {
      this.registerForm.get('presentation').enable();
    } else {
      this.registerForm.get('presentation').disable();
    }
  }

}
