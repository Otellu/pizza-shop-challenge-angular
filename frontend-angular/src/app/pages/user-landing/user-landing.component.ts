import { Component } from '@angular/core';
import { PizzaListComponent } from '../../shared/pizza-list/pizza-list.component';

@Component({
  selector: 'app-user-landing',
  standalone: true,
  imports: [PizzaListComponent],
  templateUrl: './user-landing.component.html',
  styleUrl: './user-landing.component.css'
})
export class UserLandingComponent {

}
