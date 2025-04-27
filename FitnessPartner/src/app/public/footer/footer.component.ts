import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [RouterModule,RouterLink],
  templateUrl: './footer.component.html',
  styleUrl:'./footer.component.css',
})
export class FooterComponent {

}
