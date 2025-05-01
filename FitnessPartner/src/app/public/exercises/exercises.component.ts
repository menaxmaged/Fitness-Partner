import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, Event, RouterLink } from '@angular/router';
import { LoadingSpinnerComponent } from "../../shared/loading-spinner/loading-spinner.component";
import { ActivatedRoute } from '@angular/router';
import { IdentifyMachineComponent } from "../../identify-machine/identify-machine.component";
@Component({
  selector: 'app-exercises',
  imports: [CommonModule, LoadingSpinnerComponent, RouterLink, IdentifyMachineComponent],
  templateUrl: './exercises.component.html',
  styles: ``
})
export class ExercisesComponent implements OnInit {
  isLoading =false;
  constructor(private router: Router, private route: ActivatedRoute) {
    this.router.events.subscribe((event:Event) => {
      if (event instanceof NavigationStart) {
        this.isLoading = true;
      } else if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        this.isLoading = false;
      }
    });
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

  navigateTo(type: string) {
    this.router.navigate([`/exercises/${type}`]);
  }
  
}
