import { Component } from '@angular/core';
import { RecordsCarouselComponent } from '../../components/records-carousel/records-carousel.component';
import { ToolsComponent } from '../../components/tools/tools.component';
import { ApiService } from '../../services/api-service.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RecordsCarouselComponent, ToolsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {


  dateRange: any = {
    from: {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate()
    },
    to: {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate()
    },
  };
  matricula: string = '';

  constructor(private apiService: ApiService) {
    this.apiService.getAllRecords();
  }

  filterRecords(dateRange: any, matricula?: string, desenho_motor?: string) {
    this.apiService.filterRecords(dateRange, matricula, desenho_motor);
  }
}
