import { Component } from '@angular/core';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-record-card',
  standalone: true,
  imports: [
    NgbCarouselModule
  ],
  templateUrl: './record-card.component.html',
  styleUrl: './record-card.component.scss'
})
export class RecordCardComponent {
  peca1 = '../../../assets/Pictures/peca1.jpg';
  peca2 = '../../../assets/Pictures/peca2.jpg';
  pdf = new jsPDF();

  generatePDF() {
    // Add header
    this.pdf.setFontSize(18);
    this.pdf.roundedRect(20, 30, this.pdf.getStringUnitWidth("RELATÓRIO DE OPERAÇÕES ROBÔ 1 ESTAÇÃO 60") * 18, 12, 3, 3, 'S');

    // Add variables
    var desenhoMotor = "1234567890";
    var matricula = "1234567890";
    this.pdf.setFontSize(12);
    this.pdf.rect(20, 50, this.pdf.getStringUnitWidth(`Desenho Motor: ${desenhoMotor}`) * 12, 12); // Adiciona borda ao redor da variável desenhoMotor
    this.pdf.text(`Desenho Motor: ${desenhoMotor}`, 20, 50);
    this.pdf.rect(20, 60, this.pdf.getStringUnitWidth(`Matrícula: ${matricula}`) * 12, 12); // Adiciona borda ao redor da variável matricula
    this.pdf.text(`Matrícula: ${matricula}`, 20, 60);

    // Add images
    var image1 = "../../../assets/Pictures/peca1.jpg";
    var image2 = "../../../assets/Pictures/peca2.jpg";

    // Assuming images are 100px x 100px
    this.pdf.rect(20, 70, 100, 100); // Adiciona borda ao redor da imagem1
    this.pdf.addImage(image1, 'JPEG', 20, 70, 100, 100);
    this.pdf.rect(20, 180, 100, 100); // Adiciona borda ao redor da imagem2
    this.pdf.addImage(image2, 'JPEG', 20, 180, 100, 100);

    // Save the PDF with a specific name
    this.pdf.save("report.pdf");
  }
}
