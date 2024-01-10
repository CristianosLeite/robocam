import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Record } from '../interfaces/record.interface';
import { Image } from '../interfaces/image.interface';
import { DateRange } from './../interfaces/date-range.interface';
import { Filter } from '../interfaces/filter.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  @Output() recordsChanged: EventEmitter<Record[]> = new EventEmitter<Record[]>();
  records: Record[] = [];
  filteredList: any[] = [];

  constructor(private http: HttpClient) { }

  async getAllRecords(): Promise<void> {
    await lastValueFrom(this.http.get<Record[]>('http://localhost:1880/node/get/records/all')).then((records) => {
      this.records = records;
      this.recordsChanged.emit(this.records);
    });
  }

  async getFile(pathFile: string): Promise<Image> {
    return await lastValueFrom(this.http.post<Image>('http://localhost:1880/node/get/file', { path: `${pathFile.replaceAll('&#x2F;', '/')}` }));
  }

  filterRecords(filter: Filter, dateRange: DateRange): void {
    console.log(filter);
    if (filter.matricula !== '' && filter.desenhoMotor !== '') {
      this.filteredList = [];
      this.records.forEach((record) => {
        const recordDate = new Date(record.data_hora_peca_1);
        const from = new Date(dateRange.from.year, dateRange.from.month - 1, dateRange.from.day);
        const to = new Date(dateRange.to.year, dateRange.to.month - 1, dateRange.to.day + 1);
        if (recordDate >= from && recordDate <= to) {
          this.filteredList.push(record);
        }
      });
      this.recordsChanged.emit(this.filteredList);
    }
  }
}
