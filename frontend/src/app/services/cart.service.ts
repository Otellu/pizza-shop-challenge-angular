import { Injectable, computed, signal } from '@angular/core';

export interface Pizza {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  image: string;
  veg: boolean;
  ingredients: string[];
  available: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private _items = signal<Pizza[]>([]);

  constructor() {}

  // Computed signals
  get items() {
    return this._items.asReadonly();
  }

  get totalItems() {
    return computed(() => this._items().length);
  }

  get totalPrice() {
    return computed(() => 
      this._items().reduce((total, pizza) => total + pizza.price, 0)
    );
  }

  get isEmpty() {
    return computed(() => this._items().length === 0);
  }

  // Methods
  addToCart(pizza: Pizza) {
    this._items.update(items => [...items, pizza]);
  }

  removeFromCart(pizzaId: string) {
    this._items.update(items => {
      const indexToRemove = items.findIndex(p => p.id === pizzaId);
      if (indexToRemove !== -1) {
        return items.filter((_, index) => index !== indexToRemove);
      }
      return items;
    });
  }

  clearCart() {
    this._items.set([]);
  }

  updateQuantity(pizzaId: string, quantity: number) {
    this._items.update(currentItems => {
      if (quantity <= 0) {
        // Remove all instances of this pizza
        return currentItems.filter(item => item.id !== pizzaId);
      } else {
        const currentQuantity = currentItems.filter(item => item.id === pizzaId).length;
        
        if (quantity > currentQuantity) {
          // Add more items
          const pizza = currentItems.find(item => item.id === pizzaId);
          if (pizza) {
            const itemsToAdd = Array(quantity - currentQuantity).fill(pizza);
            return [...currentItems, ...itemsToAdd];
          }
        } else if (quantity < currentQuantity) {
          // Remove some items
          const itemsToRemove = currentQuantity - quantity;
          let removed = 0;
          return currentItems.filter(item => {
            if (item.id === pizzaId && removed < itemsToRemove) {
              removed++;
              return false;
            }
            return true;
          });
        }
      }
      return currentItems;
    });
  }

  getQuantity(pizzaId: string): number {
    return this._items().filter(item => item.id === pizzaId).length;
  }

  // Get unique pizzas with quantities for display
  getCartSummary() {
    const items = this._items();
    const summary = new Map<string, { pizza: Pizza; quantity: number }>();
    
    items.forEach(pizza => {
      if (summary.has(pizza.id)) {
        summary.get(pizza.id)!.quantity++;
      } else {
        summary.set(pizza.id, { pizza, quantity: 1 });
      }
    });
    
    return Array.from(summary.values());
  }
}