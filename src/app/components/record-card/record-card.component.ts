import { Component, Input, OnInit } from '@angular/core';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { jsPDF } from 'jspdf';
import { ApiService } from '../../services/api-service.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-record-card',
  standalone: true,
  imports: [
    NgbCarouselModule,
    DatePipe
  ],
  templateUrl: './record-card.component.html',
  styleUrl: './record-card.component.scss'
})
export class RecordCardComponent implements OnInit {
  @Input() matricula: string = '';
  @Input() desenho_motor: string = '';
  @Input() local_peca_1: string = '';
  @Input() local_peca_2: string = '';
  @Input() data: string = '';

  imagem_peca_1: any;
  imagem_peca_2: string = '';
  pdf = new jsPDF();

  constructor(private apiService: ApiService) {}

  async ngOnInit() {
    this.imagem_peca_1 = (await this.apiService.getFile(this.local_peca_1)).data;
    this.imagem_peca_2 = (await this.apiService.getFile(this.local_peca_2)).data;
  }

  generatePDF() {
    alert(this.local_peca_1.replaceAll('&#x2F;', '/'));
    // Add images
    const template = "../../../assets/images/template_pdf.jpg";

    // Assuming images are 90px x 70px
    this.pdf.addImage(template, 'JPEG', 0, 0, 210, 297);
    this.pdf.text(this.matricula, 12, 97);
    this.pdf.text(this.desenho_motor, 12, 131);
    this.pdf.addImage(this.local_peca_1, 'JPEG', 94.2, 86.8, 90, 70);
    this.pdf.addImage(this.local_peca_2, 'JPEG', 94.2, 193.2, 90, 70);

    // Save the PDF with a specific name
    this.pdf.save("report.pdf");
  }
}
