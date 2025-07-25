import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface TopPizza {
  name: string;
  desc: string;
  img: string;
  alt: string;
}

@Component({
  selector: 'app-top-pizzas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './top-pizzas.component.html',
  styleUrl: './top-pizzas.component.css'
})
export class TopPizzasComponent {
  pizzas: TopPizza[] = [
    {
      name: 'Margherita',
      desc: 'Classic delight with 100% real mozzarella cheese.',
      img: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=400&q=80',
      alt: 'Margherita Pizza',
    },
    {
      name: 'Pepperoni',
      desc: 'A timeless favorite loaded with pepperoni and cheese.',
      img: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=400&q=80',
      alt: 'Pepperoni Pizza',
    },
    {
      name: 'Veggie Supreme',
      desc: 'A garden fresh treat with bell peppers, olives, and onions.',
      img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?auto=format&fit=crop&w=400&q=80',
      alt: 'Veggie Supreme Pizza',
    },
    {
      name: 'BBQ Chicken',
      desc: 'Juicy chicken, BBQ sauce, and a smoky flavor.',
      img: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=400&q=80',
      alt: 'BBQ Chicken Pizza',
    },
  ];
}
