import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { User } from '../_models/user';
import { LectureUser } from '../_models/lectureUser';
import { ReplaySubject, Observable, of, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { SeminarArchive } from '../_models/seminar';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiURL;

  private currentUserSource = new ReplaySubject<User>(1);
  currentUser$ = this.currentUserSource.asObservable();

  private registrationCompletedSource = new ReplaySubject<boolean>(1);
  registrationCompleted$ = this.registrationCompletedSource.asObservable();

  constructor(private http: HttpClient) { }

  login(model: any): Observable<void> {
    return this.http.post<User>(this.baseUrl + 'account/login', model).pipe(
      map((response: User) => {
        const user = response;
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSource.next(user);
        }
      })
    );
  }

  register(model: any): Observable<void> {
    return this.http.post<LectureUser>(this.baseUrl + 'account/register', model).pipe(
      map((user: LectureUser) => {
        if (user) {
          this.registrationCompletedSource.next(true);
        }
      })
    );
  }

  setCurrentUser(user: User) {
    this.currentUserSource.next(user);
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
  }

  deleteUser(userToDelete: any): Observable<void> {
    const currentUser = JSON.parse(localStorage.getItem('user'));

    if (currentUser && currentUser.token) {
      const headers = {
        'Authorization': `Bearer ${currentUser.token}`
      };

      return this.http.post<void>(`${this.baseUrl}users/delete`, userToDelete, { headers: headers })
    }
  }

  deleteSpamUser(userToDelete: any): Observable<void> {
    const currentUser = JSON.parse(localStorage.getItem('user'));

    if (currentUser && currentUser.token) {
      const headers = {
        'Authorization': `Bearer ${currentUser.token}`
      };
      
      return this.http.post<void>(`${this.baseUrl}users/deleteSpamUser`, userToDelete, { headers: headers })
    }
  }

  sendEmail(emailData: any): Observable<void> {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    if (currentUser && currentUser.token) {
      const headers = {
        'Authorization': `Bearer ${currentUser.token}`,
        'Content-Type': 'application/json'
      };
  
      return this.http.post<void>(`${this.baseUrl}users/sendemail`, emailData, { headers: headers })
    }
  }

  sendBulkEmail(emailData: any): Observable<void> {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    if (currentUser && currentUser.token) {
      const headers = {
        'Authorization': `Bearer ${currentUser.token}`,
        'Content-Type': 'application/json'
      };
  
      return this.http.post<void>(`${this.baseUrl}users/sendbulkemail`, emailData, { headers: headers });
    }
  }

  getSpamListEmails(): Observable<any[]> {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      const headers = {
        'Authorization': `Bearer ${user.token}`
      };

      return this.http.get<any[]>(this.baseUrl + 'users/spam', { headers: headers });
    } else {
      return of([]);
    }
  }

  getUsers(): Observable<any[]> {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user && user.token) {
      const headers = {
        'Authorization': `Bearer ${user.token}`
      };

      return this.http.get<any[]>(this.baseUrl + 'users', { headers: headers });
    } else {
      return of([]);
    }
  }

  getSeminarArchives(): Observable<SeminarArchive[]> {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user && user.token) {
      const headers = {
        'Authorization': `Bearer ${user.token}`
      };

      return this.http.get<any[]>(this.baseUrl + 'SeminarArchives', { headers: headers });
    } else {
      return of([]);
    }  
  }
  
  
}
