import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MachineModelService } from '../services/machine-model.service';

@Component({
  selector: 'app-identify-machine',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './identify-machine.component.html',
  styleUrls: ['./identify-machine.component.css']
})
export class IdentifyMachineComponent {
  selectedFile: File | null = null;
  result: string = '';
  loading = false;
  error: string = '';

  constructor(private machineService: MachineModelService) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.result = '';
      this.error = '';
    }
  }

  identify() {
    if (!this.selectedFile) return;

    this.loading = true;
    this.machineService.identifyMachine(this.selectedFile).subscribe({
      next: (res) => {
        this.result = res;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to identify image.';
        this.loading = false;
      }
    });
  }
}
