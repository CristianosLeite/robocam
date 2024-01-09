import { Component, TemplateRef, ViewEncapsulation, inject, Output, EventEmitter } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbCalendar, NgbDate, NgbDatepickerModule, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { DateRange } from '../../interfaces/date-range.interface';

@Component({
  selector: 'app-tools',
  standalone: true,
  imports: [NgbDatepickerModule, FormsModule, JsonPipe],
  templateUrl: './tools.component.html',
  styleUrl: './tools.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ToolsComponent {
  calendar = inject(NgbCalendar);
  fromDate: NgbDate = this.calendar.getToday();
  toDate: NgbDate | null = this.calendar.getNext(this.fromDate, 'd', 10);
  hoveredDate: NgbDate | null = null;

  @Output() dateRange: EventEmitter<DateRange> = new EventEmitter<DateRange>();
  @Output() matricula: EventEmitter<string> = new EventEmitter<string>();
  @Output() desenho_motor: EventEmitter<string> = new EventEmitter<string>();
  @Output() filterd: EventEmitter<boolean> = new EventEmitter<boolean>();

  private offcanvasService = inject(NgbOffcanvas);

  constructor() { }

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
