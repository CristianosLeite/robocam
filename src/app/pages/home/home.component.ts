import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api-service.service';
import { FilterApplied } from '../../interfaces/filterApplied.interafce';
import { RecordCardComponent } from '../../components/record-card/record-card.component';
import { Record } from '../../interfaces/record.interface';
import { NgIf } from '@angular/common';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RecordCardComponent, NgIf],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private subscription: Subscription = new Subscription();
  records = [] as Record[];
  peca_1: string = '';
  peca_2: string = '';
  local_peca_1: string = '';
  local_peca_2: string = '';
  matricula: string = '';
  desenho_motor: string = '';
  data_hora_peca_1: string = '';
  data_hora_peca_2: string = '';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.recordsChanged.subscribe((records) => {
      this.loadRecord(records[0]);
    });
    this.subscription.add(interval(5000).subscribe(async () => {
      await this.apiService.getAllRecords().then(() => {
        this.loadRecord(this.apiService.records[0]);
      });
    }));
  }

  loadRecord(record: Record) {
    this.peca_1 = record.peca_1;
    this.peca_2 = record.peca_2;
    this.local_peca_1 = record.local_peca_1;
    this.local_peca_2 = record.local_peca_2;
    this.matricula = record.matricula;
    this.desenho_motor = record.desenho_motor;
    this.data_hora_peca_1 = record.data_hora_peca_1;
    this.data_hora_peca_2 = record.data_hora_peca_2;
  }

  filterRecords(filterEvent: FilterApplied) {
    this.apiService.filterRecords(filterEvent);
  }
}