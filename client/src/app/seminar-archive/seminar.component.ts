import { Component, OnInit } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SeminarArchive } from '../_models/seminar';

@Component({
  selector: 'app-seminar',
  templateUrl: './seminar.component.html',
  styleUrls: ['./seminar.component.css']
})
export class SeminarComponent implements OnInit {
  seminarArchives: SeminarArchive[];
  selectedArchive: SeminarArchive | null = null;

  constructor(private seminarService: AccountService) { }

  ngOnInit(): void {
    debugger;
    this.seminarService.getSeminarArchives().subscribe(
      (data) => this.seminarArchives = data,
      (error) => console.error(error)
    );
  }

  selectArchive(archive: SeminarArchive): void {
    this.selectedArchive = this.selectedArchive === archive ? null : archive;
  }
  
}
