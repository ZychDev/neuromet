import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AccountService } from '../_services/account.service';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Content, TDocumentDefinitions } from 'pdfmake/interfaces';
import { HttpClient } from '@angular/common/http';
import { PdfDisplayService } from '../_services/pdf-display.service';

(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-generate-program',
  templateUrl: './generate-program.component.html',
  styleUrls: ['./generate-program.component.css']
})
export class GenerateProgramComponent implements OnInit {
  recordForm: UntypedFormGroup;
  records: any[] = [];
  users: any[] = []; 
  selectedUser: any; 
  editingIndex: number | null = null; 
  tempName: string = ''; 
  tempSubject: string = ''; 
  tempTime: string = '';

  constructor(
    private formBuilder: UntypedFormBuilder,
    public accountService: AccountService,
    private http: HttpClient,
    private pdfDisplayService: PdfDisplayService,
  ) {}

  ngOnInit() {
    this.initForm();
    this.loadUsers(); 
  }

  initForm() {
    this.recordForm = this.formBuilder.group({
      time: ['', Validators.required],
      name: ['', Validators.required],
      subject: [{value: '', disabled: true}, Validators.required] 
    });
  }

  deleteRecord(index: number) {
    this.records.splice(index, 1);
  }

  saveChanges(index: number) {
    if (this.editingIndex !== null) {
      const record = this.records[index];
      record.name = this.tempName; 
      record.subject = this.tempSubject;
      record.time = this.tempTime; 
      this.editingIndex = null; 
    }
  }
  

  editRecord(index: number) {
    this.editingIndex = index;
    const record = this.records[index];
    this.tempName = `${record.firstName} ${record.secondName}`;
    this.tempSubject = record.subject;
    this.tempTime = record.time; 
  }
  

  cancelEdit() {
    this.editingIndex = null; 
  }

  loadUsers() {
    this.accountService.getUsers().subscribe(
      (users: any[]) => {
        this.users = users.filter(user => user.presentation && user.presentation.trim() !== '');
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  addRecord() {
    if (this.recordForm.valid && this.selectedUser) {
      const record = {
        time: this.recordForm.get('time').value,
        name: `${this.selectedUser.firstName} ${this.selectedUser.secondName}`, 
        subject: this.recordForm.get('subject').value
      };
      this.records.push(record);
      this.records.sort((a, b) => {
        const timeA = a.time.split(':').map(Number);
        const timeB = b.time.split(':').map(Number);
        return timeA[0] * 60 + timeA[1] - (timeB[0] * 60 + timeB[1]);
      });
      this.recordForm.reset();
      this.selectedUser = null; 
      this.recordForm.get('subject').disable(); 
    }
  }
  

  onUserChange(user: any) {
    this.selectedUser = user; 
    if (user && user.presentation) {
      this.recordForm.get('subject').enable();
      this.recordForm.get('subject').setValue(user.presentation);
    } else {
      this.recordForm.get('subject').reset();
      this.recordForm.get('subject').disable();
    }
  }

  async saveAsPDF() {

    const imageUrlBackground = 'assets/background.png'; 
    const base64ImageBackground = await this.getImageBase64(imageUrlBackground);
  
    const imageUrlAgh = 'assets/aghpdf.png'; 
    const base64ImageAgh = await this.getImageBase64(imageUrlAgh);
  
    const imageUrlIsim = 'assets/isimpdf.png'; 
    const base64ImageIsim = await this.getImageBase64(imageUrlIsim);
  
    const chunkSize = 10;
    const chunks = [];
  
    for (let i = 0; i < this.records.length; i += chunkSize) {
      const chunk = this.records.slice(i, i + chunkSize);
      chunks.push(chunk);
    }
  
    const content = []; 
  
    chunks.forEach((chunk, index) => {
      if (index > 0) {
        content.push({ text: '', pageBreak: 'after' });
      }
  
      const tableBody = chunk.map(record => ([
        { text: record.time, style: 'tableTitle' },
        {
          stack: [
            { text: record.subject, style: 'tableTitle' }, 
            { text: record.name, style: 'tableBody' }, 
          ]
        }
      ]));
  
      content.push(
        { image: base64ImageBackground, width: 600, height: 850, absolutePosition: { x: 0, y: 0 } },
        { image: base64ImageAgh, width: 150, height: 100, absolutePosition: { x: 10, y: 720 } },
        { image: base64ImageIsim, width: 200, height: 100, absolutePosition: { x: 10, y: 10 } },
        {
          table: {
            widths: ['10%', '75%'],
            body: [
              [{ text: 'Time', style: 'tableHeader' }, { text: 'Description', style: 'tableHeader' }],
              ...tableBody
            ]
          },
          layout: {
            hLineWidth: function (i) { return 0; },
            vLineWidth: function (i) { return 0; },
            paddingLeft: function (i) { return i === 0 ? 0 : 8; },
            paddingRight: function (i, node) { return i === node.table.widths.length - 1 ? 0 : 8; },
            paddingTop: function (i) { return 5; },
            paddingBottom: function (i) { return 5; }
          },
          alignment: 'center',
          margin: [0, 250]
        },
        {
          text: [
            'Akademia Górniczo-Hutnicza w Krakowie\n',
            'Wydział Inżynierii Metali i Informatyki Przemysłowej\n',
            'Katedra Informatyki Stosowanej i Modelowania\n',
            'neuromet.agh.edu.pl'
          ],
          alignment: 'center',
          style: 'tableBody',
          absolutePosition: { x: 50, y: 735 }
        }
      );
    });
  
    const docDefinition: TDocumentDefinitions = {
      pageSize: 'A4',
      pageMargins: [50, 30, 40, 60],
      styles: {
        tableHeader: { bold: true, fontSize: 12, color: 'white' },
        tableTitle: { bold: true, fontSize: 9, color: 'white' },
        tableBody: { fontSize: 8, color: 'white' }
      },
      content: content
    };
  
    pdfMake.createPdf(docDefinition).download("program");
  }
  

  getImageBase64(url: string): Promise<string> {
    return this.http
      .get(url, { responseType: 'blob' })
      .toPromise()
      .then(blob => new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      }));
  }
  
}
