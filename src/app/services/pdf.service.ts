import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  pdf = new jsPDF();

  constructor() { }

  generatePDF(matricula: string, desenho_motor: string, imagem_peca_1: string, imagem_peca_2?: string) {
    // Add images

    const template = imagem_peca_2 ? "../../assets/images/template1_pdf.jpg" : "../../assets/images/template2_pdf.jpg";

    // Assuming images are 90px x 70px
    this.pdf.addImage(template, 'JPEG', 0, 0, 210, 297);
    this.pdf.text(matricula, 12, 97);
    this.pdf.text(desenho_motor, 12, 131);
    this.pdf.addImage(imagem_peca_1, 'JPEG', 94.2, 86.9, 90, 70);
    imagem_peca_2 ? this.pdf.addImage(imagem_peca_2, 'JPEG', 94.2, 193.2, 90, 70) : null;

    // Save the PDF with a specific name
    this.pdf.save("report.pdf");
  }
}
