import { Component, HostListener } from '@angular/core';
import { RecordCardComponent } from '../record-card/record-card.component';
import { Record } from '../../interfaces/record.interface';
import { ApiService } from '../../services/api-service.service';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-records-carousel',
  standalone: true,
  imports: [
    RecordCardComponent
  ],
  templateUrl: './records-carousel.component.html',
  styleUrl: './records-carousel.component.scss'
})
export class RecordsCarouselComponent {
  private subscription: Subscription = new Subscription();
  private intervalId?: number;
  records: Record[] = [];

  constructor(private apiService: ApiService) {
    this.apiService.recordsChanged.subscribe((records) => {
      this.records = records;
    });

  }

  @HostListener('mousedown', ['$event'])
  onMousedown(event: MouseEvent) {
    const button = event.target as HTMLElement;
    const content = document.querySelector('.content')!;
    const scrollAmount = button.classList.contains('slide-button-left') ? -120 : 120;

    this.intervalId = window.setInterval(() => {
      content.scrollTo({
        left: content.scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }, 200);
  }

  @HostListener('mouseup', ['$event'])
  onMouseup() {
    if (this.intervalId !== undefined) {
      window.clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }
}
