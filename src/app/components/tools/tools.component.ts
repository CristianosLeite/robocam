import { Component, TemplateRef, ViewEncapsulation, inject, Output, EventEmitter } from '@angular/core';
import { JsonPipe, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbCalendar, NgbDate, NgbDatepickerModule, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { DateRange } from '../../interfaces/date-range.interface';
import { Filter } from '../../interfaces/filter.interface';
import { FilterApplied } from '../../interfaces/filterApplied.interafce';
import { ApiService } from '../../services/api-service.service';
import { PdfService } from '../../services/pdf.service';
import { Record } from '../../interfaces/record.interface';

@Component({
  selector: 'app-tools',
  standalone: true,
  imports: [NgbDatepickerModule, FormsModule, JsonPipe, NgIf],
  templateUrl: './tools.component.html',
  styleUrl: './tools.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ToolsComponent {
  calendar = inject(NgbCalendar);
  fromDate: NgbDate = this.calendar.getToday();
  toDate: NgbDate | null = this.calendar.getToday();
  hoveredDate: NgbDate | null = null;
  filter: Filter = {} as Filter;
  dateRange = {
    from: this.fromDate,
    to: this.toDate
  } as DateRange;
  filterApplied = {} as FilterApplied;
  isApplied: boolean = false;
  records = [] as Record[];

  @Output() filterEvent: EventEmitter<FilterApplied> = new EventEmitter<FilterApplied>();

  private offcanvasService = inject(NgbOffcanvas);

  constructor(private apiService: ApiService, private pdfService: PdfService) {
    this.apiService.recordsChanged.subscribe((records) => {
      this.records = records;
    });
  }

  generatePDF() {
    let i = this.records.length;
    for (let record of this.records) {
      i--;
      this.pdfService.generatePDF(
        record.matricula,
        record.desenho_motor,
        record.data_hora_peca_1,
        record.local_peca_1,
        record.local_peca_2,
        i > 0 ? true : false
      );
    }
  }

  applyFilter(): void {
    if (!this.filterApplied.dateRange) {
      alert('Selecione um período de tempo');
      return;
    }

    if (!this.filter.matricula && !this.filter.desenhoMotor) {
      alert('informe um número de matícula ou desenho do motor');
      return;
    }

    this.isApplied = true;
    this.filterEvent.emit(this.filterApplied);
  }

  removeFilter() {
    this.dateRange.from = this.fromDate;
    this.dateRange.to = this.toDate;
    this.filter.matricula = '';
    this.filter.desenhoMotor = '';
    this.isApplied = false;
    this.filterEvent.emit();
  }

  onDateSelection(date: NgbDate) {
    this.filterApplied = {
      filter: this.filter,
      dateRange: this.dateRange
    }

    if (!this.dateRange.from && !this.dateRange.to) {
      this.dateRange.from = date;
    } else if (this.dateRange.from && !this.dateRange.to && date.after(this.dateRange.from) || date.equals(this.dateRange.from)) {
      this.dateRange.to = date;
    } else {
      this.dateRange.to = null;

      this.dateRange.from = date;
    }

    if (this.fromDate && this.toDate) {
      this.filterEvent.emit(this.filterApplied)
    }
  }

  isHovered(date: NgbDate) {
    return (
      this.dateRange.from && !this.dateRange.to && this.hoveredDate && date.after(this.dateRange.from) && date.before(this.hoveredDate)
    );
  }

  isInside(date: NgbDate) {
    return this.dateRange.to && date.after(this.dateRange.from) && date.before(this.dateRange.to);
  }

  isRange(date: NgbDate) {
    return (
      date.equals(this.dateRange.from) ||
      (this.toDate && date.equals(this.dateRange.to)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }

  openNoKeyboard(content: TemplateRef<any>) {
    this.offcanvasService.open(content, { keyboard: false });
  }
}
