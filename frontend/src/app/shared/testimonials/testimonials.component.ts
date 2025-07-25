import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Testimonial {
  name: string;
  review: string;
  img: string;
}

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.css'
})
export class TestimonialsComponent {
  testimonials: Testimonial[] = [
    {
      name: 'Priya S.',
      review: 'Absolutely loved the Margherita! Fast delivery and the crust was perfect. Will order again!',
      img: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    {
      name: 'Rahul M.',
      review: 'The best Pepperoni pizza I\'ve had in the city. Great service and friendly staff!',
      img: 'https://randomuser.me/api/portraits/men/46.jpg',
    },
    {
      name: 'Ayesha K.',
      review: 'Veggie Supreme is my new favorite. Loved the fresh toppings and quick delivery.',
      img: 'https://randomuser.me/api/portraits/women/68.jpg',
    },
  ];
}
