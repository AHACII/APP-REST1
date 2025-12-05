// [TS+HTML] menu.component.ts (Tailwind - UI like your screenshot)
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RestaurantService } from '../../services/restaurant.service';
import { Dish, Category } from '../../models/dish.model';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="bg-slate-50">
      <div class="max-w-6xl mx-auto px-4 md:px-6 py-10">
        <!-- Header -->
        <div class="text-center mb-10">
          <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            Notre Menu
          </h1>
          <p class="mt-4 text-slate-600">
            Découvrez nos plats préparés avec passion
          </p>
        </div>

        <!-- Search + Filters -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center mb-10">
          <!-- Search -->
          <div class="relative">
            <i class="bi bi-search absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-lg"></i>
            <input
              type="text"
              class="w-full h-14 pl-12 pr-5 rounded-full bg-white ring-1 ring-slate-200
                     focus:ring-2 focus:ring-violet-400 outline-none text-sm text-slate-900 placeholder:text-slate-400"
              placeholder="Rechercher un plat..."
              [(ngModel)]="searchQuery"
              (input)="onSearch()"
            />
          </div>

          <!-- Category buttons -->
          <div class="flex flex-wrap lg:justify-end gap-3">
            <!-- All -->
            <button
              type="button"
              class="h-12 px-6 rounded-full text-sm font-semibold ring-1 transition
                     inline-flex items-center justify-center"
              [ngClass]="selectedCategory === 'all'
                ? 'bg-violet-500 text-white ring-violet-500 hover:bg-violet-600'
                : 'bg-white text-slate-700 ring-slate-300 hover:bg-slate-50'"
              (click)="filterByCategory('all')"
            >
              Tous
            </button>

            <!-- Categories -->
            @for (category of categories; track category.id) {
              <button
                type="button"
                class="h-12 px-6 rounded-full text-sm font-semibold ring-1 transition
                       inline-flex items-center gap-2"
                [ngClass]="selectedCategory === category.name
                  ? 'bg-violet-500 text-white ring-violet-500 hover:bg-violet-600'
                  : 'bg-white text-slate-700 ring-slate-300 hover:bg-slate-50'"
                (click)="filterByCategory(category.name)"
              >
                <i class="bi {{ category.icon }} text-base"></i>
                <span class="leading-none">{{ category.name }}</span>
              </button>
            }
          </div>
        </div>

        <!-- Empty state -->
        @if (filteredDishes.length === 0) {
          <div class="rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 p-10 text-center">
            <div class="mx-auto h-14 w-14 rounded-2xl bg-slate-100 grid place-items-center text-slate-600 text-2xl">
              <i class="bi bi-search"></i>
            </div>
            <h3 class="mt-4 text-lg font-semibold text-slate-900">Aucun plat trouvé</h3>
            <p class="mt-1 text-slate-600">Essayez de modifier vos critères de recherche</p>
          </div>
        } @else {
          <!-- Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (dish of filteredDishes; track dish.id) {
              <article class="rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 overflow-hidden">
                <!-- Image -->
                <div class="overflow-hidden">
                  <img
                    [src]="dish.image"
                    [alt]="dish.name"
                    class="w-full h-56 object-cover"
                    onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800'"
                  />
                </div>

                <!-- Content -->
                <div class="p-6 flex flex-col min-h-[220px]">
                  <div class="text-xs uppercase tracking-wider text-slate-500">
                    {{ dish.category }}
                  </div>

                  <h3 class="mt-2 text-xl font-extrabold text-slate-900">
                    {{ dish.name }}
                  </h3>

                  <p class="mt-2 text-sm text-slate-600">
                    {{ dish.description }}
                  </p>

                  <!-- Bottom row (like screenshot) -->
                  <div class="mt-auto pt-6 flex items-center justify-between gap-4">
                    <div class="text-xl font-extrabold text-violet-600">
                      {{ dish.price }} DH
                    </div>

                    <button
                      type="button"
                      class="h-11 px-6 rounded-full text-sm font-semibold inline-flex items-center gap-2
                             transition active:scale-[0.99]"
                      [ngClass]="addedToCart[dish.id]
                        ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                        : 'bg-violet-500 text-white hover:bg-violet-600'"
                      (click)="addToCart(dish)"
                    >
                      @if (addedToCart[dish.id]) {
                        <i class="bi bi-check2"></i>
                        <span>Ajouté</span>
                      } @else {
                        <i class="bi bi-cart3"></i>
                        <span>Ajouter</span>
                      }
                    </button>
                  </div>
                </div>
              </article>
            }
          </div>
        }
      </div>
    </section>
  `
})
export class MenuComponent implements OnInit {
  dishes: Dish[] = [];
  filteredDishes: Dish[] = [];
  categories: Category[] = [];
  selectedCategory = 'all';
  searchQuery = '';
  addedToCart: { [key: number]: boolean } = {};

  constructor(private restaurantService: RestaurantService) {}

  ngOnInit(): void {
    this.restaurantService.dishes$.subscribe(dishes => {
      this.dishes = dishes;
      this.filterDishes();
    });

    this.restaurantService.categories$.subscribe(categories => {
      this.categories = categories;
    });
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    this.filterDishes();
  }

  filterDishes(): void {
    let result = this.dishes;

    if (this.selectedCategory !== 'all') {
      result = result.filter(dish => dish.category === this.selectedCategory);
    }

    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      result = result.filter(dish =>
        dish.name.toLowerCase().includes(query) ||
        dish.description.toLowerCase().includes(query)
      );
    }

    this.filteredDishes = result;
  }

  onSearch(): void {
    this.filterDishes();
  }

  addToCart(dish: Dish): void {
    this.restaurantService.addToCart(dish);
    this.addedToCart[dish.id] = true;

    setTimeout(() => {
      this.addedToCart[dish.id] = false;
    }, 1500);
  }
}
