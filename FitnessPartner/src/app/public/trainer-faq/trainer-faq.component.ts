import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IFAQ } from '../../models/i-faq';
@Component({
  selector: 'app-trainer-faq',
  imports: [CommonModule],
  templateUrl: './trainer-faq.component.html',
  styleUrl: './trainer-faq.component.css',
})
export class TrainerFAQComponent {
  @Input() faqs?: IFAQ[];
}
