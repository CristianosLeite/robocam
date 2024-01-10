import { Component, TemplateRef, ViewEncapsulation, inject, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbCalendar, NgbDate, NgbDatepickerModule, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { DateRange } from '../../interfaces/date-range.interface';
import { Filter } from '../../interfaces/filter.interface';

@Component({
  selector: 'app-tools',
  standalone: true,
  imports: [NgbDatepickerModule, FormsModule, JsonPipe],
  templateUrl: './tools.component.html',
  styleUrl: './tools.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ToolsComponent implements OnChanges {
  calendar = inject(NgbCalendar);
  fromDate: NgbDate = this.calendar.getToday();
  toDate: NgbDate | null = this.calendar.getNext(this.fromDate, 'd', 10);
  hoveredDate: NgbDate | null = null;
  matricula: string = '';
  desenhoMotor: string = '';

  @Output() dateRange: EventEmitter<DateRange> = new EventEmitter<DateRange>();
  @Output() filterApplied: EventEmitter<Filter> = new EventEmitter<Filter>();

  private offcanvasService = inject(NgbOffcanvas);

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.matricula);
      this.filterApplied.emit({
        matricula: this.matricula,
        desenhoMotor: this.desenhoMotor,
      });
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate) || date.equals(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }

    if (this.fromDate && this.toDate) {
      this.dateRange.emit({
        from: {
          year: this.fromDate.year,
          month: this.fromDate.month,
          day: this.fromDate.day,
        },
        to: {
          year: this.toDate.year,
          month: this.toDate.month,
          day: this.toDate.day,
        },
      });
    }
  }

  isHovered(date: NgbDate) {
    return (
      this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate)
    );
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }

  openNoKeyboard(content: TemplateRef<any>) {
    this.offcanvasService.open(content, { keyboard: false });
  }
}
