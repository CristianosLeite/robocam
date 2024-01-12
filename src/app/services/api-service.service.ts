import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, lastValueFrom, map } from 'rxjs';
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

  constructor(private http: HttpClient) {
    this.getAllRecords().then(() => {
      this.recordsChanged.emit(this.records);
    });
  }

  async getAllRecords(): Promise<void> {
    await lastValueFrom(this.http.get<Record[]>('http://172.18.172.165:1880/node/get/records/all')).then((records) => {
      this.records = records;
    });
  }

  public getFile(pathFile: string): Observable<Image> {
    return this.http.post<Image>('http://172.18.172:1880/node/get/file', { path: `${pathFile.replaceAll('&#x2F;', '/')}` });
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
