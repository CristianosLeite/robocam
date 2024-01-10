import { Component } from '@angular/core';
import { RecordsCarouselComponent } from '../../components/records-carousel/records-carousel.component';
import { ToolsComponent } from '../../components/tools/tools.component';
import { ApiService } from '../../services/api-service.service';
import { DateRange } from '../../interfaces/date-range.interface';
import { Filter } from '../../interfaces/filter.interface';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RecordsCarouselComponent, ToolsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  dateRange: DateRange = {
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
  filter = {} as Filter;

  constructor(private apiService: ApiService) {
    this.apiService.getAllRecords();
  }

  filterRecords(filter: Filter, DateRange: DateRange = this.dateRange) {
    this.apiService.filterRecords(filter, DateRange);
  }
}
