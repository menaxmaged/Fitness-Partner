import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MachineModelService } from '../services/machine-model.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-identify-machine',
  standalone: true,
  imports: [CommonModule, TranslateModule, ReactiveFormsModule, FormsModule],
  templateUrl: './identify-machine.component.html',
  styleUrls: ['./identify-machine.component.css'],
})
export class IdentifyMachineComponent implements OnInit{
  selectedFile: File | null = null;
  result: string = '';
  loading = false;
  error: string = '';
  safeResult: SafeHtml = '';
  // resultId = document.getElementById('resultId') as HTMLDivElement;
  constructor(
    private machineService: MachineModelService,
    private sanitizer: DomSanitizer,
    private translate: TranslateService, private route: ActivatedRoute
  ) {
    this.translate.setDefaultLang('en');
  }

  ngOnInit() {
    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        const el = document.getElementById(fragment);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  }

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
        this.safeResult = this.sanitizer.bypassSecurityTrustHtml(res);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to identify image.';
        this.loading = false;
      },
    });
  }
}
