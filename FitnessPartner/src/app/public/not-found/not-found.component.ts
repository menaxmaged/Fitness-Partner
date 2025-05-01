import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-not-found',
  imports: [TranslateModule],
  templateUrl: './not-found.component.html',
  styles: ``,
})
export class NotFoundComponent {
  constructor(private router: Router, private translate: TranslateService) {
    this.translate.setDefaultLang('en');
  }
  goHome() {
    this.router.navigate(['/']);
  }
}
