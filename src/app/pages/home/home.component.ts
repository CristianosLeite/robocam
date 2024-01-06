import { Component } from '@angular/core';
import { RecordsCarouselComponent } from '../../components/records-carousel/records-carousel.component';
import { ToolsComponent } from '../../components/tools/tools.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RecordsCarouselComponent, ToolsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
