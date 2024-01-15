import { Component } from '@angular/core';
import { RecordsCarouselComponent } from '../../components/records-carousel/records-carousel.component';
import { ToolsComponent } from '../../components/tools/tools.component';
import { ApiService } from '../../services/api-service.service';
import { FilterApplied } from '../../interfaces/filterApplied.interafce';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RecordsCarouselComponent, ToolsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  constructor(private apiService: ApiService) {}

  filterRecords(filterEvent: FilterApplied) {
    this.apiService.filterRecords(filterEvent);
  }
}
