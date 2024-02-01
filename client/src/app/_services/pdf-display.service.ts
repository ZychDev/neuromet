import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PdfDisplayService {
  private showPdfSource = new BehaviorSubject<boolean>(false);
  currentShowPdf = this.showPdfSource.asObservable();

  constructor() { }

  changeShowPdf(showPdf: boolean) {
    this.showPdfSource.next(showPdf);
  }
}
