import { Component, OnInit } from '@angular/core';
import { PdfDisplayService } from '../_services/pdf-display.service';
@Component({
  selector: 'app-program',
  templateUrl: './program.component.html',
  styleUrls: ['./program.component.css']
})
export class ProgramComponent implements OnInit {
  showPdf: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  openPdf() {
    const pdfUrl = 'assets/program.pdf'; 
    window.open(pdfUrl, '_blank'); 
  }
}