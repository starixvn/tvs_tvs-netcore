import { Component, Input } from '@angular/core';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'add-request-skeleton',
  standalone: true,
  imports: [NgxSkeletonLoaderModule],
  templateUrl: './add-request-skeleton.component.html',
  styleUrl: './add-request-skeleton.component.scss'
})
export class AddRequestSkeletonComponent {
  @Input() eventHeight: string;
}
