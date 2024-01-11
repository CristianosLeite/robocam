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
  @Input() data: string = '';

  imagem_peca_1: string = '';
  imagem_peca_2: string = '';
  peca: string = '';

  constructor(private apiService: ApiService, private pdfService: PdfService) {}

  async ngOnInit() {
    this.imagem_peca_1 = (await this.apiService.getFile(this.local_peca_1)).data;
    this.imagem_peca_2 = (await this.apiService.getFile(this.local_peca_2)).data;
  }

  generatePDF(matricula: string, desenho_motor: string, data: string, local_peca_1: string, local_peca_2?: string) {
    this.pdfService.generatePDF(matricula, desenho_motor, data, local_peca_1, local_peca_2);
  }
}
