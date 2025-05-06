import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-bro-split',
  imports: [CommonModule],
  templateUrl: './bro-split.component.html',
  styleUrl: './bro-split.component.css'
})
export class BroSplitComponent {
  expandedSection: string = 'overview';
  
  toggleSection(section: string): void {
    this.expandedSection = this.expandedSection === section ? '' : section;
  }
}
