import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { RestaurantService } from '../../services/restaurant.service';
import { CartItem } from '../../models/dish.model';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="max-w-6xl mx-auto px-4 md:px-6 py-10">
      <!-- Title -->
      <div class="text-center mb-8">
        <h1 class="text-3xl md:text-4xl font-extrabold text-slate-900">Votre Commande</h1>
      </div>

      <!-- Empty Cart -->
      @if (cartItems.length === 0 && !orderConfirmed) {
        <div class="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 p-10 text-center">
          <div class="mx-auto h-14 w-14 rounded-2xl bg-slate-100 grid place-items-center text-slate-600 text-2xl">
            <i class="bi bi-cart-x"></i>
          </div>

          <h3 class="mt-4 text-lg font-semibold text-slate-900">Votre panier est vide</h3>
          <p class="mt-1 text-slate-600">
            Ajoutez des plats depuis notre menu pour commencer votre commande
          </p>

          <a
            routerLink="/menu"
            class="mt-5 inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-2.5 font-semibold text-white
                   bg-gradient-to-r from-indigo-500 to-fuchsia-500 shadow-sm hover:opacity-95 active:scale-[0.99] transition"
          >
            <i class="bi bi-book"></i>
            Voir le menu
          </a>
        </div>
      } @else if (!orderConfirmed) {
        <!-- Content -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <!-- Cart -->
          <div class="lg:col-span-2">
            <div class="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 overflow-hidden">
              <div class="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <h2 class="text-lg font-semibold text-slate-900 inline-flex items-center gap-2">
                  <i class="bi bi-cart3"></i>
                  Articles
                  <span class="text-slate-500 font-medium">({{ cartItems.length }})</span>
                </h2>

                <div class="flex items-center gap-2">
                  <button
                    type="button"
                    class="inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold
                           ring-1 ring-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 transition"
                    (click)="clearCart()"
                  >
                    <i class="bi bi-trash"></i>
                    Vider
                  </button>

                  <a
                    routerLink="/menu"
                    class="inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold
                           ring-1 ring-slate-200 bg-white hover:bg-slate-50 transition"
                  >
                    <i class="bi bi-plus-lg"></i>
                    Ajouter
                  </a>
                </div>
              </div>

              <div class="p-5">
                <div class="divide-y divide-slate-100">
                  @for (item of cartItems; track item.dish.id) {
                    <div class="py-4 flex flex-col sm:flex-row sm:items-center gap-4">
                      <!-- Image -->
                      <img
                        [src]="item.dish.image"
                        [alt]="item.dish.name"
                        class="h-20 w-20 rounded-2xl object-cover ring-1 ring-slate-200"
                        onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100'"
                      />

                      <!-- Info -->
                      <div class="flex-1">
                        <div class="font-semibold text-slate-900">{{ item.dish.name }}</div>
                        <div class="text-sm text-slate-600">{{ item.dish.price }} DH</div>
                      </div>

                      <!-- Quantity -->
                      <div class="flex items-center gap-2">
                        <button
                          type="button"
                          class="h-10 w-10 rounded-2xl ring-1 ring-slate-200 bg-white hover:bg-slate-50 transition grid place-items-center"
                          (click)="updateQuantity(item.dish.id, item.quantity - 1)"
                          aria-label="Diminuer"
                        >
                          <i class="bi bi-dash"></i>
                        </button>

                        <span class="min-w-10 text-center font-semibold text-slate-900">
                          {{ item.quantity }}
                        </span>

                        <button
                          type="button"
                          class="h-10 w-10 rounded-2xl ring-1 ring-slate-200 bg-white hover:bg-slate-50 transition grid place-items-center"
                          (click)="updateQuantity(item.dish.id, item.quantity + 1)"
                          aria-label="Augmenter"
                        >
                          <i class="bi bi-plus"></i>
                        </button>
                      </div>

                      <!-- Price + Remove -->
                      <div class="flex items-center justify-between sm:justify-end gap-3 sm:w-[220px]">
                        <div class="font-extrabold text-amber-700">
                          {{ item.dish.price * item.quantity }} DH
                        </div>

                        <button
                          type="button"
                          class="h-10 w-10 rounded-2xl ring-1 ring-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 transition grid place-items-center"
                          (click)="removeItem(item.dish.id)"
                          aria-label="Supprimer"
                        >
                          <i class="bi bi-trash"></i>
                        </button>
                      </div>
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>

          <!-- Checkout -->
          <div class="lg:col-span-1">
            <div class="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 overflow-hidden">
              <div class="px-5 py-4 border-b border-slate-100">
                <h2 class="text-lg font-semibold text-slate-900 inline-flex items-center gap-2">
                  <i class="bi bi-receipt"></i>
                  Finaliser la commande
                </h2>
              </div>

              <div class="p-5">
                <form [formGroup]="orderForm" (ngSubmit)="submitOrder()" class="space-y-4">
                  <!-- Name -->
                  <div>
                    <label class="text-sm font-medium text-slate-700">Nom complet *</label>
                    <input
                      type="text"
                      formControlName="customerName"
                      class="mt-1 h-11 w-full rounded-2xl bg-white px-4 text-sm ring-1 outline-none
                             focus:ring-2 focus:ring-indigo-400"
                      [class.ring-slate-200]="!(orderForm.get('customerName')?.invalid && orderForm.get('customerName')?.touched)"
                      [class.ring-rose-300]="orderForm.get('customerName')?.invalid && orderForm.get('customerName')?.touched"
                    />
                    @if (orderForm.get('customerName')?.invalid && orderForm.get('customerName')?.touched) {
                      <p class="mt-1 text-xs text-rose-600">
                        Le nom est requis (minimum 2 caractères)
                      </p>
                    }
                  </div>

                  <!-- Phone -->
                  <div>
                    <label class="text-sm font-medium text-slate-700">Téléphone *</label>
                    <input
                      type="tel"
                      formControlName="phone"
                      class="mt-1 h-11 w-full rounded-2xl bg-white px-4 text-sm ring-1 outline-none
                             focus:ring-2 focus:ring-indigo-400"
                      [class.ring-slate-200]="!(orderForm.get('phone')?.invalid && orderForm.get('phone')?.touched)"
                      [class.ring-rose-300]="orderForm.get('phone')?.invalid && orderForm.get('phone')?.touched"
                    />
                    @if (orderForm.get('phone')?.invalid && orderForm.get('phone')?.touched) {
                      <p class="mt-1 text-xs text-rose-600">
                        Numéro de téléphone invalide
                      </p>
                    }
                  </div>

                  <!-- Type -->
                  <div>
                    <label class="text-sm font-medium text-slate-700">Type de commande *</label>

                    <div class="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <label class="flex items-center gap-2 rounded-2xl ring-1 ring-slate-200 bg-white px-4 py-3 cursor-pointer hover:bg-slate-50 transition">
                        <input
                          type="radio"
                          class="h-4 w-4 accent-indigo-600"
                          formControlName="orderType"
                          value="sur_place"
                        />
                        <span class="inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
                          <i class="bi bi-shop"></i> Sur place
                        </span>
                      </label>

                      <label class="flex items-center gap-2 rounded-2xl ring-1 ring-slate-200 bg-white px-4 py-3 cursor-pointer hover:bg-slate-50 transition">
                        <input
                          type="radio"
                          class="h-4 w-4 accent-indigo-600"
                          formControlName="orderType"
                          value="a_emporter"
                        />
                        <span class="inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
                          <i class="bi bi-bag"></i> À emporter
                        </span>
                      </label>
                    </div>
                  </div>

                  <div class="pt-2 border-t border-slate-100"></div>

                  <!-- Totals -->
                  <div class="space-y-2">
                    <div class="flex items-center justify-between text-sm text-slate-700">
                      <span>Sous-total</span>
                      <span>{{ total }} DH</span>
                    </div>

                    <div class="flex items-end justify-between">
                      <span class="font-semibold text-slate-900">Total</span>
                      <span class="text-2xl font-extrabold text-amber-700">
                        {{ total }} DH
                      </span>
                    </div>
                  </div>

                  <!-- Submit -->
                  <button
                    type="submit"
                    class="w-full inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 font-semibold text-white
                           bg-gradient-to-r from-indigo-500 to-fuchsia-500 shadow-sm hover:opacity-95 active:scale-[0.99]
                           disabled:opacity-50 disabled:cursor-not-allowed transition"
                    [disabled]="orderForm.invalid || cartItems.length === 0"
                  >
                    <i class="bi bi-check2-circle"></i>
                    Valider la commande
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- Confirmation -->
      @if (orderConfirmed) {
        <div class="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 p-10 text-center">
          <div class="mx-auto h-14 w-14 rounded-2xl bg-emerald-50 text-emerald-600 grid place-items-center text-2xl">
            <i class="bi bi-check-circle-fill"></i>
          </div>

          <h2 class="mt-4 text-2xl font-extrabold text-slate-900">Commande confirmée !</h2>
          <p class="mt-2 text-slate-600">
            Votre commande <span class="font-semibold text-slate-900">#{{ orderId }}</span> a été enregistrée avec succès.<br />
            Nous la préparons avec soin.
          </p>

          <div class="mt-6 flex flex-col sm:flex-row gap-2 justify-center">
            <a
              routerLink="/menu"
              class="inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-2.5 font-semibold text-white
                     bg-gradient-to-r from-indigo-500 to-fuchsia-500 shadow-sm hover:opacity-95 active:scale-[0.99] transition"
            >
              <i class="bi bi-book"></i>
              Retour au menu
            </a>

            <button
              type="button"
              class="inline-flex items-center justify-center rounded-2xl px-5 py-2.5 font-semibold text-slate-700
                     ring-1 ring-slate-200 bg-white hover:bg-slate-50 transition"
              (click)="closeConfirmation()"
            >
              Nouvelle commande
            </button>
          </div>
        </div>
      }
    </div>
  `
})
export class OrderComponent implements OnInit {
  cartItems: CartItem[] = [];
  orderForm: FormGroup;
  orderConfirmed = false;
  orderId = 0;

  constructor(
    private restaurantService: RestaurantService,
    private fb: FormBuilder
  ) {
    this.orderForm = this.fb.group({
      customerName: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9+\s-]{8,15}$/)]],
      orderType: ['sur_place', Validators.required]
    });
  }

  ngOnInit(): void {
    this.restaurantService.cart$.subscribe(items => {
      this.cartItems = items;
    });
  }

  get total(): number {
    return this.restaurantService.getCartTotal();
  }

  updateQuantity(dishId: number, quantity: number): void {
    this.restaurantService.updateCartItemQuantity(dishId, quantity);
  }

  removeItem(dishId: number): void {
    this.restaurantService.removeFromCart(dishId);
  }

  clearCart(): void {
    this.restaurantService.clearCart();
  }

  submitOrder(): void {
    if (this.orderForm.valid && this.cartItems.length > 0) {
      const order = this.restaurantService.addOrder({
        items: [...this.cartItems],
        customerName: this.orderForm.value.customerName,
        phone: this.orderForm.value.phone,
        orderType: this.orderForm.value.orderType,
        total: this.total
      });

      this.orderId = order.id;
      this.orderConfirmed = true;
      this.orderForm.reset({ orderType: 'sur_place' });
    }
  }

  closeConfirmation(): void {
    this.orderConfirmed = false;
  }
}
