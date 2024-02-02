import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-mail',
  templateUrl: './mail.component.html',
  styleUrls: ['./mail.component.css']
})
export class MailComponent implements OnInit {
  users: any[] = [];
  selectedUsers: any[] = [];
  emailForm: UntypedFormGroup;
  spamListEmails: any[] = [];
  selectedSpamEmails: any[] = [];
  registerForm: UntypedFormGroup;
  newUser: { firstName: string; secondName: string; emailAddress: string; university: string; };

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
    this.loadSpamListEmails(); 
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
  
  selectAllUsers(event: any) {
    const isChecked = event.target.checked;
    this.selectedUsers = isChecked ? this.users.map(user => user.emailAddress) : [];
    
    const userCheckboxes = document.getElementsByClassName('user-checkbox') as HTMLCollectionOf<HTMLInputElement>;
    for (let i = 0; i < userCheckboxes.length; i++) {
      userCheckboxes[i].checked = isChecked;
    }
  }

  onUserCheckboxChange(emailAddress: string, isChecked: boolean) {
    if (isChecked) {
      this.selectedUsers.push(emailAddress);
    } else {
      this.selectedUsers = this.selectedUsers.filter(email => email !== emailAddress);
    }
  }

  sendBulkEmail() {
    const combinedSelectedEmails = [...this.selectedUsers, ...this.selectedSpamEmails];
  
    if (this.emailForm.valid && combinedSelectedEmails.length) {
      const emailData = {
        emailAddresses: combinedSelectedEmails, 
        subject: this.emailForm.value.subject,
        body: this.emailForm.value.body
      };
  
      this.accountService.sendBulkEmail(emailData).subscribe(
        () => {
          this.toastr.success('Emails sent successfully');
          this.emailForm.reset();
          this.selectedUsers = [];
          this.selectedSpamEmails = [];
        },
        (error) => {
          console.error('Error sending emails:', error);
          this.toastr.error('Failed to send emails');
        }
      );
    } else {
      this.toastr.error('No users selected or form is invalid!');
    }
  }
  

  loadSpamListEmails() {
    this.accountService.getSpamListEmails().subscribe(
      (emails: any[]) => {
        this.spamListEmails = emails;
      },
      (error) => {
        console.error('Error fetching spam list emails:', error);
      }
    );
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
  

  selectAllSpam(event: any) {
    const isChecked = event.target.checked;
    this.selectedSpamEmails = isChecked ? this.spamListEmails.map(email => email.mail) : [];
  }

  onSpamCheckboxChange(emailAddress: string, isChecked: boolean) {
    if (isChecked) {
      this.selectedSpamEmails.push(emailAddress);
    } else {
      this.selectedSpamEmails = this.selectedSpamEmails.filter(email => email !== emailAddress);
    }
  }



}
