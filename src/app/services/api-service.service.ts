import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, lastValueFrom } from 'rxjs';
import { Record } from '../interfaces/record.interface';
import { Image } from '../interfaces/image.interface';
import { DateRange } from './../interfaces/date-range.interface';
import { FilterApplied } from '../interfaces/filterApplied.interafce';

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

  public async getFile(pathFile: string): Promise<Image> {
    return await lastValueFrom(this.http.post<Image>('http://localhost:1880/node/get/file', { path: `${pathFile.replaceAll('&#x2F;', '/')}` })
  }

  public filterRecords(filterEvent: FilterApplied) {
    if (!filterEvent) {
      this.recordsChanged.emit(this.records);
      return;
    }

    if (Object.keys(filterEvent.filter).length === 0) {
      this.recordsChanged.emit(this.filterRecordsByDate(filterEvent.dateRange, this.records));
      return;
    }

    if (filterEvent.filter.matricula !== '') {
      this.recordsChanged.emit(this.filterRecordsByDate(filterEvent.dateRange, this.filterRecordsByMatricula(filterEvent.filter.matricula)));
    } else if (filterEvent.filter.desenhoMotor !== '') {
      this.recordsChanged.emit(this.filterRecordsByDate(filterEvent.dateRange, this.filterRecordsByDesenhoMotor(filterEvent.filter.desenhoMotor)));
    } else {
      this.recordsChanged.emit(this.filterRecordsByDate(filterEvent.dateRange, this.records));
    }
  }

  private defaultImage(): Image {
    return {data: `PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iY3VycmVudENvbG9yIiBjbGFzcz0iYmkgYmktY2FyZC1pbWFnZSIgdmlld0JveD0iMCAwIDE2IDE2Ij4KICA8cGF0aCBkPSJNNi4wMDIgNS41YTEuNSAxLjUgMCAxIDEtMyAwIDEuNSAxLjUgMCAwIDEgMyAwIi8+CiAgPHBhdGggZD0iTTEuNSAyQTEuNSAxLjUgMCAwIDAgMCAzLjV2OUExLjUgMS41IDAgMCAwIDEuNSAxNGgxM2ExLjUgMS41IDAgMCAwIDEuNS0xLjV2LTlBMS41IDEuNSAwIDAgMCAxNC41IDJ6bTEzIDFhLjUuNSAwIDAgMSAuNS41djZsLTMuNzc1LTEuOTQ3YS41LjUgMCAwIDAtLjU3Ny4wOTNsLTMuNzEgMy43MS0yLjY2LTEuNzcyYS41LjUgMCAwIDAtLjYzLjA2MkwxLjAwMiAxMnYuNTRMMSAxMi41di05YS41LjUgMCAwIDEgLjUtLjV6Ii8+Cjwvc3ZnPg==`}
  }

  private filterRecordsByDate(dateRange: DateRange, records: Record[]): Record[] {
    const filteredList = [] as Record[];
    records.forEach((record) => {
      const recordDate = new Date(record.data_hora_peca_1);
      const from = new Date(dateRange.from.year, dateRange.from.month - 1, dateRange.from.day);
      const to = new Date(dateRange.to!.year, dateRange.to!.month - 1, dateRange.to!.day + 1);
      if (recordDate >= from && recordDate <= to) {
        filteredList.push(record);
      }
    });

    return filteredList;
  }

  private filterRecordsByMatricula(matricula: string): Record[] {
    const filterdList = this.especifFilter('matricula', matricula);
    return filterdList;
  }

  private filterRecordsByDesenhoMotor(desenhoMotor: string): Record[] {
    const filterdList = this.especifFilter('desenho_motor', desenhoMotor);
    return filterdList;
  }

  private especifFilter(param: string, value: string): Record[] {
    if (param !== 'matricula' && param !== 'desenho_motor') {
      return [];
    }
    const filteredList = [] as Record[];
    this.records.forEach((record) => {
      if (record[`${param}`] === value) {
        filteredList.push(record);
      }
    });
    return filteredList;
  }
}
