import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-body-fat-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './body-fat-calculator.component.html',
  styleUrls: ['./body-fat-calculator.component.css'],
})
export class BodyFatCalculatorComponent {
  formData = {
    age: null,
    weight: null,
    height: null,
    neck: null,
    waist: null,
    hip: null,
    gender: '',
  };

  result: any;

  calculateFat(fatForm: NgForm) {
    if (fatForm.invalid) {
      alert('Please fill in all required fields correctly.');
      return;
    }

     const waist = this.formData.waist || 0;
    const neck = this.formData.neck || 0;
    const height = this.formData.height || 0;
    const hip = this.formData.hip || 0;

    let bodyFatPercentage = 0;

     if (this.formData.gender === 'male') {
      bodyFatPercentage =
        86.01 * Math.log10(waist - neck) - 70.041 * Math.log10(height) + 36.76;
    } else if (this.formData.gender === 'female') {
      bodyFatPercentage =
        163.205 * Math.log10(waist + hip - neck) - 97.684 * Math.log10(height) - 78.387;
    }

     this.result = {
      bodyFat: bodyFatPercentage.toFixed(2),
      status: this.getCategory(bodyFatPercentage),
    };
  }

  getCategory(bodyFatPercentage: number): string {
    if (bodyFatPercentage < 18) {
      return 'Underfat';
    } else if (bodyFatPercentage >= 18 && bodyFatPercentage <= 24) {
      return 'Healthy';
    } else if (bodyFatPercentage > 24 && bodyFatPercentage <= 30) {
      return 'Overfat';
    } else {
      return 'Obese';
    }
  }
}
