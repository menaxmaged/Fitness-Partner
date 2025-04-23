import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

interface Item {
  name: string;
  image: string;
}

interface SubCard {
  title: string;
  description?: string;
  image: string;
  items?: Item[];
}

@Component({
  selector: 'app-nutrition-details',
  imports: [CommonModule],
  templateUrl: './nutrition-details.component.html',
  styleUrl: './nutrition-details.component.css',
})
export class NutritionDetailsComponent implements OnInit {
  nutrientId!: number;
  subCards: SubCard[] = [];

  data: { [key: number]: SubCard[] } = {
    1: [
      {
        title: 'Complex Carbs',
        image: 'assets/complexCarbs.jpg',
        items: [
          { name: 'Oats', image: 'assets/Oats.jpg' },
          { name: 'Brown Rice', image: 'assets/brownRice.jpg' },
          { name: 'Sweet Potato', image: 'assets/sweetPotatojpg.jpg' },
        ],
      },
      {
        title: 'Simple Carbs',
        image: 'assets/simpleCarbs.webp',
        items: [
          { name: 'Sugar', image: 'assets/Sugar.jpg' },
          { name: 'White Bread', image: 'assets/WhiteBread.jpg' },
          { name: 'Soda', image: 'assets/soda.jpg' },
        ],
      },
    ],
    2: [
      {
        title: 'Animal Protein',
        image: 'assets/animalProtein.jpg',
        items: [
          { name: 'Chicken', image: 'assets/Chicken.jpg' },
          { name: 'Fish', image: 'assets/fish.jpg' },
          { name: 'Eggs', image: 'assets/Eggs.jpg' },
        ],
      },
      {
        title: 'Plant Protein',
        image: 'assets/PlantProtein.jpeg',
        items: [
          { name: 'Lentils', image: 'assets/Lentils.jpg' },
          { name: 'Tofu', image: 'assets/Tofu.jpg' },
          { name: 'Chickpeas', image: 'assets/Chickpeas.jpg' },
        ],
      },
    ],
    3: [
      {
        title: 'Healthy Fats',
        image: 'assets/HealthyFats.jpg',
        items: [
          { name: 'Avocado', image: 'assets/Avocado.jpg' },
          { name: 'Olive Oil', image: 'assets/OliveOil.jpg' },
          { name: 'Almonds', image: 'assets/almonds.jpg' },
        ],
      },
      {
        title: 'Unhealthy Fats',
        image: 'assets/UnhealthyFats.jpg',
        items: [
          { name: 'French Fries', image: 'assets/FrenchFries.jpg' },
          { name: 'Donuts', image: 'assets/Donuts.jpg' },
          { name: 'Biscuits', image: 'assets/biscuits.jpg' },
        ],
      },
    ],
  };

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.nutrientId = +this.route.snapshot.paramMap.get('id')!;
    this.subCards = this.data[this.nutrientId] || [];
  }
}
