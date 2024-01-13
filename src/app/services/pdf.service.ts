import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  pdf = new jsPDF();

  constructor() { }

  generatePDF(matricula: string, desenho_motor: string, data_hora_peca_1: string, data_hora_peca_2: string, imagem_peca_1: string, imagem_peca_2?: string, multiple: boolean = false) {
    // Add images

    const template = imagem_peca_2 ? "./assets/images/template1_pdf.jpg" : "./assets/images/template2_pdf.jpg";

    // Assuming images are 90px x 70px
    this.pdf.setFontSize(12);
    this.pdf.addImage(template, 'JPEG', 0, 0, 210, 297);
    this.pdf.text(matricula, 10, 85.5);
    this.pdf.text(desenho_motor, 10, 110.5);
    if (imagem_peca_2) {
      this.pdf.addImage(imagem_peca_1, 'JPEG', 81.5, 77, 108, 80);
      this.pdf.addImage(imagem_peca_2, 'JPEG', 81.5, 182, 108, 80);
      this.pdf.text(data_hora_peca_1, 110, 164);
      this.pdf.text(data_hora_peca_2, 110, 269);
      this.pdf.text('OPERAÇÃO', 22, 238.5);
      this.pdf.text('TAMPA PEQUENA', 22, 247.5);
      this.pdf.text('TAMPA 336', 22, 256.5);
    } else {
      this.pdf.addImage(imagem_peca_1, 'JPEG', 82.8, 110.2, 107, 80);
      this.pdf.text(data_hora_peca_1, 110, 198);
      this.pdf.text('OPERAÇÃO', 22, 238.5);
      this.pdf.text('TAMPA PEQUENA', 22, 247.5);
    }

    if (multiple) {
      this.pdf.addPage();
      return;
    }

    this.pdf.save("report.pdf");
    this.pdf = new jsPDF();
  }
}
