import { Component, OnInit } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SeminarArchive } from '../_models/seminar';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-seminar',
  templateUrl: './seminar.component.html',
  styleUrls: ['./seminar.component.css']
})
export class SeminarComponent implements OnInit {
  seminarArchives: SeminarArchive[] = [];
  filteredSeminarArchives: SeminarArchive[] = [];
  selectedArchive: SeminarArchive | null = null;
  selectedYear: string = ''; 

  constructor(private seminarService: AccountService) {}

  ngOnInit(): void {
    this.seminarService.getSeminarArchives().subscribe(
      data => {
        this.seminarArchives = data;
        this.filteredSeminarArchives = [...this.seminarArchives];
      },
      error => console.error(error)
    );
  }

  filterArchivesByYear(): void {
    this.filteredSeminarArchives = this.selectedYear ? this.seminarArchives.filter(archive => archive.year.toString() === this.selectedYear) : [...this.seminarArchives];
  }

  getUniqueYears(): string[] {
    return [...new Set(this.seminarArchives.map(archive => archive.year.toString()))].sort((a, b) => parseInt(b) - parseInt(a));
  }

  selectArchive(archive: SeminarArchive): void {
    this.selectedArchive = this.selectedArchive === archive ? null : archive;
  }
}
