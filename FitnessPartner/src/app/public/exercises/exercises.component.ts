import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, Event, RouterLink, ActivatedRoute } from '@angular/router';
import { LoadingSpinnerComponent } from "../../shared/loading-spinner/loading-spinner.component";
import { IdentifyMachineComponent } from "../../identify-machine/identify-machine.component";
import { TranslateModule, TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-exercises',
  imports: [CommonModule, LoadingSpinnerComponent, RouterLink, TranslateModule, IdentifyMachineComponent],
  templateUrl: './exercises.component.html',
  styles: ``
})
export class ExercisesComponent{
  isLoading =false;
  constructor(private router: Router, private translate: TranslateService) {
      this.translate.setDefaultLang('en');
    this.router.events.subscribe((event:Event) => {
      if (event instanceof NavigationStart) {
        this.isLoading = true;
      } else if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        this.isLoading = false;
      }
    });
  }

  // ngOnInit() {
  //   this.route.fragment.subscribe(fragment => {
  //     if (fragment) {
  //       const el = document.getElementById(fragment);
  //       if (el) {
  //         el.scrollIntoView({ behavior: 'smooth' });
  //       }
  //     }
  //   });
  // }

  navigateTo(type: string) {
    this.router.navigate([`/exercises/${type}`]);
  }

}
