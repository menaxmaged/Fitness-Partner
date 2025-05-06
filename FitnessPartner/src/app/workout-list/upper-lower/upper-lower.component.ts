import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
    imports:[CommonModule],
  selector: 'app-upper-lower-split',
  templateUrl: './upper-lower.component.html',
  styleUrls: ['./upper-lower.component.css']
})
export class UpperLowerSplitComponent {
  expandedSection: string = 'overview';
  
  toggleSection(section: string): void {
    this.expandedSection = this.expandedSection === section ? '' : section;
  }
}