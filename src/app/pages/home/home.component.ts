import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api-service.service';
import { FilterApplied } from '../../interfaces/filterApplied.interafce';
import { RecordCardComponent } from '../../components/record-card/record-card.component';
import { Record } from '../../interfaces/record.interface';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RecordCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  records = [] as Record[];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.recordsChanged.subscribe((records) => {
      this.records = records;
    });
  }

  filterRecords(filterEvent: FilterApplied) {
    this.apiService.filterRecords(filterEvent);
  }
}
