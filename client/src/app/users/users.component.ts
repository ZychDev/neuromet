import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
declare var $: any;

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  baseUrl = 'https://localhost:5001/api/';
  confirmDeleteUser: any = null; 
  registerForm: UntypedFormGroup;
  showPresentationField = false; 
  newUser: { firstName: string; secondName: string; emailAddress: string; university: string; };
  emailForm: UntypedFormGroup;
  selectedUser: any;

  constructor(
    private httpClient: HttpClient, 
    public accountService: AccountService,
    private toastr: ToastrService,
    private formBuilder: UntypedFormBuilder,
  ) {}
  ngOnInit() {
    this.initForm();
    this.initEmailForm();
    this.loadUsers();
    this.newUser = { firstName: '', secondName: '', emailAddress: '', university: '' };
  }
  
  initForm() {
    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      secondName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      emailAddress: ['', [Validators.required, Validators.email]],
      university: ['', [Validators.required]],
      presentation: [{value: '', disabled: true}, [Validators.minLength(2), Validators.maxLength(100)]] 
    });
  }

  initEmailForm() {
    this.emailForm = this.formBuilder.group({
      subject: ['', [Validators.required]],
      body: ['', [Validators.required]],
    });
  }

  togglePresentationField() {
    this.showPresentationField = !this.showPresentationField;
    if (this.showPresentationField) {
      this.registerForm.get('presentation').enable();
    } else {
      this.registerForm.get('presentation').disable();
    }
  }

  loadUsers() {
    this.accountService.getUsers().subscribe(
      (users: any[]) => {
        this.users = users;
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  registerUser() {
    if (this.registerForm.valid) {
      this.accountService.register(this.registerForm.value).subscribe(
        (response: any) => {
          this.users.push(response); 
          this.registerForm.reset();
          this.toastr.success('User added successfully');
          this.loadUsers();
          $('#addUserModal').modal('hide');
        },
        (error) => {
          console.error('Error adding user:', error);
          this.toastr.error('Failed to add user');
        }
      );
    } else {
      this.toastr.error('Form is not valid!');
    }
  }

  deleteUser(user: any) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.accountService.deleteUser(user).subscribe(
        () => {
          this.users = this.users.filter(u => u !== user);
          this.toastr.success('User deleted successfully');
        },
        (error) => {
          console.error('Error deleting user:', error);
          this.toastr.error('Failed to delete user');
        }
      );
    }
  }

  sortUsers() {
    this.users.sort((a, b) => a.firstName.localeCompare(b.firstName)); 
  }

  openEmailModal(user: any) {
      this.selectedUser = user;
      $('#emailModal').modal('show');
    }

  sendEmail() {
    if (this.emailForm.valid) {
      const emailData = {
        emailAddress: this.selectedUser.emailAddress,
        subject: this.emailForm.value.subject,
        body: this.emailForm.value.body
      };
      this.accountService.sendEmail(emailData).subscribe(
        () => {
          this.toastr.success('Email sent successfully');
          $('#emailModal').modal('hide');
          this.emailForm.reset();
        },
        (error) => {
          console.error('Error sending email:', error);
          this.toastr.error('Failed to send email');
        }
      );
    }
  }

}
