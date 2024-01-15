import { Component, Input, OnInit } from '@angular/core';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api-service.service';
import { DatePipe, NgIf } from '@angular/common';
import { PdfService } from '../../services/pdf.service';

@Component({
  selector: 'app-record-card',
  standalone: true,
  imports: [
    NgbCarouselModule,
    DatePipe,
    NgIf
  ],
  templateUrl: './record-card.component.html',
  styleUrl: './record-card.component.scss'
})
export class RecordCardComponent implements OnInit {
  @Input() matricula: string = '';
  @Input() desenho_motor: string = '';
  @Input() local_peca_1: string = '';
  @Input() local_peca_2: string = '';
  @Input() peca_1: string = '';
  @Input() peca_2: string = '';
  @Input() data_hora_peca_1: string = '';
  @Input() data_hora_peca_2: string = '';

  imagem_peca_1: string = '';
  imagem_peca_2: string = '';

  constructor(private apiService: ApiService, private pdfService: PdfService) {}

  async ngOnInit() {
    this.apiService.getFile(this.local_peca_1).then((data) => {
      this.imagem_peca_1 = data.data;
    });
    this.apiService.getFile(this.local_peca_2).then((data) => {
      this.imagem_peca_2 = data.data;
    });
  }

  generatePDF(matricula: string, desenho_motor: string, data_hora_peca_1: string, data_hora_peca_2: string, peca_1: string, peca_2: string, imagem_peca_1: string, imagem_peca_2?: string) {
    this.pdfService.generatePDF(matricula, desenho_motor, data_hora_peca_1, data_hora_peca_2, peca_1, peca_2, imagem_peca_1, imagem_peca_2);
  }
}
