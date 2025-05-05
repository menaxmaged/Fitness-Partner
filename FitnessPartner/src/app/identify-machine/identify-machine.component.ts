// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { MachineModelService } from '../services/machine-model.service';
// import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { TranslateModule, TranslateService } from '@ngx-translate/core';
// import { ActivatedRoute } from '@angular/router';
// import { Router } from '@angular/router'
// // @Component({
// //   selector: 'app-identify-machine',
// //   standalone: true,
// //   imports: [CommonModule, TranslateModule, ReactiveFormsModule, FormsModule],
// //   templateUrl: './identify-machine.component.html',
// //   styleUrls: ['./identify-machine.component.css'],
// // })
// // export class IdentifyMachineComponent implements OnInit{
// //   selectedFile: File | null = null;
// //   result: string = '';
// //   loading = false;
// //   error: string = '';
// //   safeResult: SafeHtml = '';
// //   // resultId = document.getElementById('resultId') as HTMLDivElement;
// //   constructor(
// //     private machineService: MachineModelService,
// //     private sanitizer: DomSanitizer,
// //     private translate: TranslateService, private route: ActivatedRoute
// //   ) {
// //     this.translate.setDefaultLang('en');
// //   }

// //   ngOnInit() {
// //     this.route.fragment.subscribe(fragment => {
// //       if (fragment) {
// //         const el = document.getElementById(fragment);
// //         if (el) {
// //           el.scrollIntoView({ behavior: 'smooth' });
// //         }
// //       }
// //     });
// //   }

// //   onFileSelected(event: Event) {
// //     const input = event.target as HTMLInputElement;
// //     if (input.files && input.files.length > 0) {
// //       this.selectedFile = input.files[0];
// //       this.result = '';
// //       this.error = '';
// //     }
// //   }

// //   identify() {
// //     if (!this.selectedFile) return;

// //     this.loading = true;
// //     this.machineService.identifyMachine(this.selectedFile).subscribe({
// //       next: (res) => {
// //         this.result = res;
// //         this.safeResult = this.sanitizer.bypassSecurityTrustHtml(res);
// //         this.loading = false;
// //       },
// //       error: (err) => {
// //         this.error = 'Failed to identify image.';
// //         this.loading = false;
// //       },
// //     });
// //   }
// // }

// @Component({
//   selector: 'app-identify-machine',
//   standalone: true,
//   imports: [CommonModule, TranslateModule, ReactiveFormsModule, FormsModule],
//   templateUrl: './identify-machine.component.html',
//   styleUrls: ['./identify-machine.component.css'],
// })
// export class IdentifyMachineComponent implements OnInit {
//   selectedFile: File | null = null;
//   result: string = '';
//   loading = false;
//   error: string = '';
//   safeResult: SafeHtml = '';
//   muscle: string | null = null;

//   constructor(
//     private machineService: MachineModelService,
//     private sanitizer: DomSanitizer,
//     private translate: TranslateService,
//     private route: ActivatedRoute,
//     private router: Router
//   ) {
//     this.translate.setDefaultLang('en');
//   }

//   ngOnInit() {
//     this.route.fragment.subscribe((fragment) => {
//       if (fragment) {
//         const el = document.getElementById(fragment);
//         if (el) {
//           el.scrollIntoView({ behavior: 'smooth' });
//         }
//       }
//     });
//   }

//   onFileSelected(event: Event) {
//     const input = event.target as HTMLInputElement;
//     if (input.files && input.files.length > 0) {
//       this.selectedFile = input.files[0];
//       this.result = '';
//       this.error = '';
//     }
//   }

// //   identify() {
// //     if (!this.selectedFile) return;

// //     this.loading = true;
// //     this.machineService.identifyMachine(this.selectedFile).subscribe({
// //       next: (res) => {
// //         this.result = res;
// //         const match = res.match(/\((\s*chest|leg|shoulders|abs|back|arms\s*)\)/i);
// //         // this.muscle = match ? match[1].toLowerCase() : null;
// //         this.muscle = 'chest';
// //         console.log('Extracted muscle:', this.muscle);
// //         this.safeResult = this.sanitizer.bypassSecurityTrustHtml(res);
// //         this.loading = false;
// //       },
// //       error: (err) => {
// //         this.error = 'Failed to identify image.';
// //         this.loading = false;
// //       },
// //     });
// //   }
// identify() {
//     if (!this.selectedFile) return;
//   console.log('Selected file:', this.selectedFile);
//     this.loading = true;
//     this.machineService.identifyMachine(this.selectedFile).subscribe({
//       next: (res) => {
//         this.result = res;
//         // Improved regex for natural language responses
//         const match = res.match(/\b(chest|leg|shoulders|abs|back|arms)\b/i);
//         // const match = res.match(/(?:targets|works?|focuses on|for)\s*(?:the)?\s*(chest|legs?|shoulders?|abs|back|arms?|biceps?|triceps?|pectoral|quadriceps?|hamstrings?|calves)/i);
//         this.muscle = match ? this.extractMuscleWithRegex(match[1].toLowerCase()) : 'chest';
//         console.log('API Response:', res);
//         console.log('Extracted muscle:', this.muscle);
        
//         this.safeResult = this.sanitizer.bypassSecurityTrustHtml(res);
//         this.loading = false;
//       },
//       error: (err) => {
//         this.error = 'Failed to identify image.';
//         this.loading = false;
//       },
//     });
//   }
//   private extractMuscleWithRegex(response: string): string {
//     // Define regex patterns to match muscle groups
//     const musclePatterns: RegExp[] = [
//         /pectorals?|chest/i,   // Pectorals or Chest
//         /biceps?/i,            // Biceps
//         /triceps?/i,           // Triceps
//         /quads?/i,             // Quads
//         /hamstrings?/i,        // Hamstrings
//         /glutes?/i,            // Glutes
//         /back/i,               // Back
//         /shoulders?/i         // Shoulders
//     ];

//     // Iterate over patterns and test for matches
//     for (let pattern of musclePatterns) {
//         if (pattern.test(response)) {  // Use `test()` for better performance
//             return pattern.source; // Return the matched muscle or muscle group name (pattern source)
//         }
//     }

//     return "No muscle identified"; // If no muscle is found
// }
//   // Helper function to normalize muscle names
//   // private normalizeMuscleName(muscle: string): string {
//   //   const mappings: {[key: string]: string} = {
//   //     'pectoral': 'chest',
//   //     'biceps': 'arms',
//   //     'triceps': 'arms',
//   //     'quadriceps': 'legs',
//   //     'hamstrings': 'legs',
//   //     'calves': 'legs'
//   //   };
//   //   return mappings[muscle] || muscle;
//   // }
// //   navigateToExercises(): void {
// //     if (this.muscle) {
// //       console.log('Navigating to muscle:', this.muscle);
// //       this.router.navigate(['/exercises/gym', this.muscle]);
// //     } else {
// //       console.warn('Muscle not found or not set.');
// //     }
// //   }
// navigateToExercises(): void {
//     this.identify();
//     console.log('Navigating to muscle:', this.muscle);
//     this.router.navigate(['/exercises/gym', this.muscle]);
// }
// }





import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MachineModelService } from '../services/machine-model.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-identify-machine',
  standalone: true,
  imports: [CommonModule, TranslateModule, ReactiveFormsModule, FormsModule],
  templateUrl: './identify-machine.component.html',
  styleUrls: ['./identify-machine.component.css'],
})
export class IdentifyMachineComponent implements OnInit {
  selectedFile: File | null = null;
  result: string = '';
  loading = false;
  error: string = '';
  safeResult: SafeHtml = '';
  muscle: string | null = null;

  constructor(
    private machineService: MachineModelService,
    private sanitizer: DomSanitizer,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.translate.setDefaultLang('en');
  }

  ngOnInit() {
    this.route.fragment.subscribe((fragment) => {
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

        // Normalized muscle mapping
        const muscleMap: { [key: string]: string } = {
          pectorals: 'chest',
          chest: 'chest',
          leg: 'legs',
          legs: 'legs',
          quadriceps: 'legs',
          hamstrings: 'legs',
          calves: 'legs',
          glutes: 'legs',
          shoulders: 'shoulders',
          deltoids: 'shoulders',
          abs: 'abs',
          abdominals: 'abs',
          core: 'abs',
          back: 'back',
          lats: 'back',
          arms: 'arms',
          biceps: 'arms',
          triceps: 'arms'
        };

        let found = null;
        const lowerRes = res.toLowerCase();
        for (const [key, value] of Object.entries(muscleMap)) {
          if (lowerRes.includes(key)) {
            found = value;
            break;
          }
        }

        this.muscle = found;
        console.log('API Response:', res);
        console.log('Extracted muscle:', this.muscle);

        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to identify image.';
        this.loading = false;
      },
    });
  }

  navigateToExercises(): void {
    if (this.muscle) {
      console.log('Navigating to muscle:', this.muscle);
      this.router.navigate(['/exercises/gym', this.muscle]);
    } else {
      console.warn('Muscle not found or not set.');
    }
  }
}
