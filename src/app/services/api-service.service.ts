import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Record } from '../interfaces/record.interface';
import { Image } from '../interfaces/image.interface';
import { DateRange } from './../interfaces/date-range.interface';

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
    return await lastValueFrom(this.http.post<Image>('http://localhost:1880/node/get/file', { path: pathFile.replaceAll('&#x2F;', '/') }));
  }

  filterRecords(dateRange: DateRange, matricula?: string, desenho_motor?: string): void {
    this.filteredList = [];
    this.records.forEach((record) => {
      const recordDate = new Date(record.data_hora_peca_1);
      const from = new Date(dateRange.from.year, dateRange.from.month - 1, dateRange.from.day);
      const to = new Date(dateRange.to.year, dateRange.to.month - 1, dateRange.to.day + 1);
      if (recordDate >= from && recordDate <= to) {
        if (matricula !== undefined && matricula !== '' && record.matricula !== matricula) {
          return;
        }
        if (desenho_motor !== undefined && desenho_motor !== '' && record.desenho_motor !== desenho_motor) {
          return;
        }
        this.filteredList.push(record);
      }
    });
    this.recordsChanged.emit(this.filteredList);
  }
}
