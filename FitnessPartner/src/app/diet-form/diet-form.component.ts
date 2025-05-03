import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DietAiService } from '../services/diet-ai.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-diet-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './diet-form.component.html',
  styleUrls: ['./diet-form.component.css']
})
export class DietFormComponent implements OnInit{
  formData = {
    age: null,
    weight: null,
    height: null,
    waist: null,
    neck: null,
    gender: '',
    goal: ''
  };

  result: string = '';
  loading = false;
  error = '';

  constructor(private dietService: DietAiService , private route:ActivatedRoute) {}

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

  submit() {
    this.loading = true;
    this.result = '';
    this.error = '';

    this.dietService.generateDietPlan(this.formData).subscribe({
      next: (res) => {
        this.result = res;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to generate diet plan. Try again later.';
        this.loading = false;
      }
    });
  }
}
