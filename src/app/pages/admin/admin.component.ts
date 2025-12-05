// [TS+HTML] admin.component.ts (Tailwind UI like your screenshot)
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { RestaurantService } from '../../services/restaurant.service';
import { Dish, Order, Reservation, Category } from '../../models/dish.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="min-h-[calc(100vh-64px)] bg-slate-50">
      <div class="grid grid-cols-1 md:grid-cols-[280px_1fr]">
        <!-- Sidebar -->
        <aside class="bg-gradient-to-b from-indigo-500 to-fuchsia-500 text-white md:min-h-[calc(100vh-64px)]">
          <div class="p-6">
            <div class="flex items-center gap-3 font-extrabold text-xl">
              <div class="h-10 w-10 rounded-2xl bg-white/15 grid place-items-center">
                <i class="bi bi-gear text-xl"></i>
              </div>
              <span>Administration</span>
            </div>

            <nav class="mt-8 space-y-2">
              <!-- Item -->
              <button
                type="button"
                (click)="setActiveTab('dashboard')"
                class="w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition text-white/90 hover:bg-white/10"
                [ngClass]="activeTab === 'dashboard' ? 'bg-white/15 text-white ring-1 ring-white/20' : ''"
              >
                <i class="bi bi-speedometer2 text-lg"></i>
                <span class="font-semibold">Tableau de bord</span>
              </button>

              <button
                type="button"
                (click)="setActiveTab('dishes')"
                class="w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition text-white/90 hover:bg-white/10"
                [ngClass]="activeTab === 'dishes' ? 'bg-white/15 text-white ring-1 ring-white/20' : ''"
              >
                <i class="bi bi-book text-lg"></i>
                <span class="font-semibold">Plats</span>
              </button>

              <button
                type="button"
                (click)="setActiveTab('categories')"
                class="w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition text-white/90 hover:bg-white/10"
                [ngClass]="activeTab === 'categories' ? 'bg-white/15 text-white ring-1 ring-white/20' : ''"
              >
                <i class="bi bi-tags text-lg"></i>
                <span class="font-semibold">Catégories</span>
              </button>

              <button
                type="button"
                (click)="setActiveTab('orders')"
                class="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl transition text-white/90 hover:bg-white/10"
                [ngClass]="activeTab === 'orders' ? 'bg-white/15 text-white ring-1 ring-white/20' : ''"
              >
                <span class="flex items-center gap-3">
                  <i class="bi bi-cart3 text-lg"></i>
                  <span class="font-semibold">Commandes</span>
                </span>
                @if (confirmedOrders > 0) {
                  <span class="min-w-7 h-7 px-2 rounded-full bg-amber-300 text-slate-900 text-xs font-extrabold grid place-items-center">
                    {{ confirmedOrders }}
                  </span>
                }
              </button>

              <button
                type="button"
                (click)="setActiveTab('reservations')"
                class="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl transition text-white/90 hover:bg-white/10"
                [ngClass]="activeTab === 'reservations' ? 'bg-white/15 text-white ring-1 ring-white/20' : ''"
              >
                <span class="flex items-center gap-3">
                  <i class="bi bi-calendar-check text-lg"></i>
                  <span class="font-semibold">Réservations</span>
                </span>
                @if (pendingReservations > 0) {
                  <span class="min-w-7 h-7 px-2 rounded-full bg-amber-300 text-slate-900 text-xs font-extrabold grid place-items-center">
                    {{ pendingReservations }}
                  </span>
                }
              </button>
            </nav>
          </div>
        </aside>

        <!-- Main -->
        <main class="p-6 md:p-8">
          <!-- DASHBOARD -->
          @if (activeTab === 'dashboard') {
            <h1 class="text-3xl md:text-4xl font-extrabold text-slate-900">Tableau de bord</h1>

            <div class="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div class="rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 p-6">
                <div class="flex items-center gap-4">
                  <div class="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 grid place-items-center text-xl">
                    <i class="bi bi-book"></i>
                  </div>
                  <div>
                    <div class="text-3xl font-extrabold text-slate-900">{{ dishes.length }}</div>
                    <div class="text-sm text-slate-600">Plats au menu</div>
                  </div>
                </div>
              </div>

              <div class="rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 p-6">
                <div class="flex items-center gap-4">
                  <div class="h-12 w-12 rounded-2xl bg-fuchsia-50 text-fuchsia-600 grid place-items-center text-xl">
                    <i class="bi bi-cart3"></i>
                  </div>
                  <div>
                    <div class="text-3xl font-extrabold text-slate-900">{{ orders.length }}</div>
                    <div class="text-sm text-slate-600">Commandes</div>
                  </div>
                </div>
              </div>

              <div class="rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 p-6">
                <div class="flex items-center gap-4">
                  <div class="h-12 w-12 rounded-2xl bg-amber-50 text-amber-700 grid place-items-center text-xl">
                    <i class="bi bi-calendar-check"></i>
                  </div>
                  <div>
                    <div class="text-3xl font-extrabold text-slate-900">{{ reservations.length }}</div>
                    <div class="text-sm text-slate-600">Réservations</div>
                  </div>
                </div>
              </div>

              <div class="rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 p-6">
                <div class="flex items-center gap-4">
                  <div class="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-700 grid place-items-center text-xl">
                    <i class="bi bi-currency-dollar"></i>
                  </div>
                  <div>
                    <div class="text-3xl font-extrabold text-slate-900">{{ totalRevenue }} DH</div>
                    <div class="text-sm text-slate-600">Chiffre d'affaires</div>
                  </div>
                </div>
              </div>
            </div>
          }

          <!-- DISHES -->
          @if (activeTab === 'dishes') {
            <div class="flex items-center justify-between gap-4">
              <div>
                <h1 class="text-3xl md:text-4xl font-extrabold text-slate-900">Gestion des plats</h1>
                <p class="mt-1 text-slate-600">Ajouter, modifier et supprimer des plats</p>
              </div>

              <button
                type="button"
                (click)="openAddDishModal()"
                class="h-12 px-6 rounded-full text-sm font-semibold text-white
                       bg-gradient-to-r from-indigo-500 to-fuchsia-500 hover:opacity-95 transition
                       inline-flex items-center gap-2 shadow-sm"
              >
                <i class="bi bi-plus-lg"></i>
                Ajouter un plat
              </button>
            </div>

            <div class="mt-6 rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 overflow-hidden">
              <!-- Table header (purple) -->
              <div class="bg-gradient-to-r from-indigo-500 to-fuchsia-500">
                <div class="grid grid-cols-[140px_1fr_260px_140px_170px] text-white/95 font-semibold text-sm">
                  <div class="px-6 py-4">Image</div>
                  <div class="px-6 py-4">Nom</div>
                  <div class="px-6 py-4">Catégorie</div>
                  <div class="px-6 py-4">Prix</div>
                  <div class="px-6 py-4">Actions</div>
                </div>
              </div>

              <!-- Rows -->
              <div class="divide-y divide-slate-100">
                @for (dish of dishes; track dish.id) {
                  <div class="grid grid-cols-[140px_1fr_260px_140px_170px] items-center">
                    <div class="px-6 py-4">
                      <img
                        [src]="dish.image"
                        [alt]="dish.name"
                        class="h-14 w-14 rounded-2xl object-cover ring-1 ring-slate-200"
                        onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100'"
                      />
                    </div>

                    <div class="px-6 py-4">
                      <div class="font-extrabold text-slate-900">{{ dish.name }}</div>
                      <div class="text-sm text-slate-600">
                        {{ dish.description | slice:0:55 }}...
                      </div>
                    </div>

                    <div class="px-6 py-4 text-slate-900">
                      {{ dish.category }}
                    </div>

                    <div class="px-6 py-4 font-extrabold text-amber-600">
                      {{ dish.price }} DH
                    </div>

                    <div class="px-6 py-4 flex items-center gap-3">
                      <button
                        type="button"
                        (click)="openEditDishModal(dish)"
                        class="h-10 w-10 rounded-2xl ring-1 ring-indigo-400 text-indigo-600 bg-white hover:bg-indigo-50 transition grid place-items-center"
                        aria-label="Edit dish"
                      >
                        <i class="bi bi-pencil"></i>
                      </button>

                      <button
                        type="button"
                        (click)="deleteDish(dish.id)"
                        class="h-10 w-10 rounded-2xl ring-1 ring-rose-400 text-rose-600 bg-white hover:bg-rose-50 transition grid place-items-center"
                        aria-label="Delete dish"
                      >
                        <i class="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                }
              </div>
            </div>
          }

          <!-- CATEGORIES -->
          @if (activeTab === 'categories') {
            <div class="flex items-center justify-between gap-4">
              <div>
                <h1 class="text-3xl md:text-4xl font-extrabold text-slate-900">Gestion des catégories</h1>
                <p class="mt-1 text-slate-600">Ajouter, modifier et supprimer des catégories</p>
              </div>

              <button
                type="button"
                (click)="openAddCategoryModal()"
                class="h-12 px-6 rounded-full text-sm font-semibold text-white
                       bg-gradient-to-r from-indigo-500 to-fuchsia-500 hover:opacity-95 transition
                       inline-flex items-center gap-2 shadow-sm"
              >
                <i class="bi bi-plus-lg"></i>
                Ajouter une catégorie
              </button>
            </div>

            <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              @for (category of categories; track category.id) {
                <div class="rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 p-6">
                  <div class="flex items-center gap-4">
                    <div class="h-14 w-14 rounded-2xl bg-amber-50 text-amber-700 grid place-items-center text-2xl">
                      <i class="bi {{ category.icon }}"></i>
                    </div>
                    <div class="flex-1">
                      <div class="font-extrabold text-slate-900">{{ category.name }}</div>
                      <div class="text-sm text-slate-600">{{ category.icon }}</div>
                    </div>

                    <button
                      type="button"
                      (click)="openEditCategoryModal(category)"
                      class="h-10 w-10 rounded-2xl ring-1 ring-indigo-400 text-indigo-600 bg-white hover:bg-indigo-50 transition grid place-items-center"
                    >
                      <i class="bi bi-pencil"></i>
                    </button>

                    <button
                      type="button"
                      (click)="deleteCategory(category.id)"
                      class="h-10 w-10 rounded-2xl ring-1 ring-rose-400 text-rose-600 bg-white hover:bg-rose-50 transition grid place-items-center"
                    >
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              }
            </div>
          }

          <!-- ORDERS -->
          @if (activeTab === 'orders') {
            <h1 class="text-3xl md:text-4xl font-extrabold text-slate-900">Commandes</h1>

            @if (orders.length === 0) {
              <div class="mt-6 rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 p-10 text-center">
                <div class="mx-auto h-14 w-14 rounded-2xl bg-slate-100 grid place-items-center text-slate-600 text-2xl">
                  <i class="bi bi-cart-x"></i>
                </div>
                <h3 class="mt-4 text-lg font-semibold text-slate-900">Aucune commande</h3>
                <p class="mt-1 text-slate-600">Les commandes apparaîtront ici</p>
              </div>
            } @else {
              <div class="mt-6 rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 overflow-hidden">
                <div class="overflow-x-auto">
                  <table class="min-w-[1100px] w-full text-left">
                    <thead class="bg-slate-900 text-white">
                      <tr class="text-sm font-semibold">
                        <th class="px-6 py-4">#</th>
                        <th class="px-6 py-4">Client</th>
                        <th class="px-6 py-4">Articles</th>
                        <th class="px-6 py-4">Total</th>
                        <th class="px-6 py-4">Type</th>
                        <th class="px-6 py-4">Date</th>
                        <th class="px-6 py-4">Statut</th>
                        <th class="px-6 py-4">Actions</th>
                      </tr>
                    </thead>

                    <tbody class="divide-y divide-slate-100">
                      @for (order of orders; track order.id) {
                        <tr class="text-sm">
                          <td class="px-6 py-5 font-extrabold text-slate-900">#{{ order.id }}</td>

                          <td class="px-6 py-5">
                            <div class="font-semibold text-slate-900">{{ order.customerName }}</div>
                            <div class="text-slate-600">{{ order.phone }}</div>
                          </td>

                          <td class="px-6 py-5 text-slate-700">
                            @for (item of order.items; track item.dish.id) {
                              <div>{{ item.quantity }}x {{ item.dish.name }}</div>
                            }
                          </td>

                          <td class="px-6 py-5 font-extrabold text-amber-600">{{ order.total }} DH</td>

                          <td class="px-6 py-5 text-slate-700">
                            @if (order.orderType === 'sur_place') {
                              <span class="inline-flex items-center gap-2">
                                <i class="bi bi-shop"></i> Sur place
                              </span>
                            } @else {
                              <span class="inline-flex items-center gap-2">
                                <i class="bi bi-bag"></i> À emporter
                              </span>
                            }
                          </td>

                          <td class="px-6 py-5 text-slate-700">{{ formatDate(order.date) }}</td>

                          <td class="px-6 py-5">
                            <span
                              class="inline-flex items-center justify-center px-4 py-2 rounded-full text-xs font-extrabold"
                              [ngClass]="statusPillClass(order.status)"
                            >
                              {{
                                order.status === 'pending' ? 'En attente' :
                                order.status === 'confirmed' ? 'Confirmée' : 'Terminée'
                              }}
                            </span>
                          </td>

                          <td class="px-6 py-5">
                            <div class="flex items-center gap-3">
                              <select
                                class="h-11 px-4 rounded-full ring-1 ring-slate-200 bg-white text-sm font-semibold text-slate-700"
                                [value]="order.status"
                                (change)="updateOrderStatus(order.id, $any($event.target).value)"
                              >
                                <option value="pending">En attente</option>
                                <option value="confirmed">Confirmée</option>
                                <option value="completed">Terminée</option>
                              </select>

                              <button
                                type="button"
                                (click)="deleteOrder(order.id)"
                                class="h-11 w-11 rounded-2xl ring-1 ring-rose-400 text-rose-600 bg-white hover:bg-rose-50 transition grid place-items-center"
                              >
                                <i class="bi bi-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            }
          }

          <!-- RESERVATIONS -->
          @if (activeTab === 'reservations') {
            <h1 class="text-3xl md:text-4xl font-extrabold text-slate-900">Réservations</h1>

            @if (reservations.length === 0) {
              <div class="mt-6 rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 p-10 text-center">
                <div class="mx-auto h-14 w-14 rounded-2xl bg-slate-100 grid place-items-center text-slate-600 text-2xl">
                  <i class="bi bi-calendar-x"></i>
                </div>
                <h3 class="mt-4 text-lg font-semibold text-slate-900">Aucune réservation</h3>
                <p class="mt-1 text-slate-600">Les réservations apparaîtront ici</p>
              </div>
            } @else {
              <div class="mt-6 rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 overflow-hidden">
                <div class="overflow-x-auto">
                  <table class="min-w-[1100px] w-full text-left">
                    <thead class="bg-slate-900 text-white">
                      <tr class="text-sm font-semibold">
                        <th class="px-6 py-4">#</th>
                        <th class="px-6 py-4">Client</th>
                        <th class="px-6 py-4">Contact</th>
                        <th class="px-6 py-4">Personnes</th>
                        <th class="px-6 py-4">Date</th>
                        <th class="px-6 py-4">Heure</th>
                        <th class="px-6 py-4">Statut</th>
                        <th class="px-6 py-4">Actions</th>
                      </tr>
                    </thead>

                    <tbody class="divide-y divide-slate-100">
                      @for (reservation of reservations; track reservation.id) {
                        <tr class="text-sm">
                          <td class="px-6 py-5 font-extrabold text-slate-900">#{{ reservation.id }}</td>
                          <td class="px-6 py-5 font-semibold text-slate-900">{{ reservation.name }}</td>
                          <td class="px-6 py-5 text-slate-700">
                            <div>{{ reservation.email }}</div>
                            <div class="text-slate-500">{{ reservation.phone }}</div>
                          </td>
                          <td class="px-6 py-5 text-slate-700 inline-flex items-center gap-2">
                            <i class="bi bi-people"></i> {{ reservation.numberOfPeople }}
                          </td>
                          <td class="px-6 py-5 text-slate-700">{{ formatDate(reservation.date).split(' ')[0] }}</td>
                          <td class="px-6 py-5 text-slate-700">{{ reservation.time }}</td>

                          <td class="px-6 py-5">
                            <span
                              class="inline-flex items-center justify-center px-4 py-2 rounded-full text-xs font-extrabold"
                              [ngClass]="reservationPillClass(reservation.status)"
                            >
                              {{
                                reservation.status === 'pending' ? 'En attente' :
                                reservation.status === 'confirmed' ? 'Confirmée' : 'Annulée'
                              }}
                            </span>
                          </td>

                          <td class="px-6 py-5">
                            <div class="flex items-center gap-3">
                              <select
                                class="h-11 px-4 rounded-full ring-1 ring-slate-200 bg-white text-sm font-semibold text-slate-700"
                                [value]="reservation.status"
                                (change)="updateReservationStatus(reservation.id, $any($event.target).value)"
                              >
                                <option value="pending">En attente</option>
                                <option value="confirmed">Confirmée</option>
                                <option value="cancelled">Annulée</option>
                              </select>

                              <button
                                type="button"
                                (click)="deleteReservation(reservation.id)"
                                class="h-11 w-11 rounded-2xl ring-1 ring-rose-400 text-rose-600 bg-white hover:bg-rose-50 transition grid place-items-center"
                              >
                                <i class="bi bi-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            }
          }
        </main>
      </div>

      <!-- Dish Modal -->
      @if (showDishModal) {
        <div class="fixed inset-0 z-[60]">
          <div class="absolute inset-0 bg-black/50" (click)="closeDishModal()"></div>

          <div class="relative mx-auto mt-10 w-[92%] max-w-3xl rounded-3xl bg-white shadow-xl ring-1 ring-slate-200 overflow-hidden">
            <div class="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
              <h3 class="text-lg font-extrabold text-slate-900">
                {{ editingDish ? 'Modifier le plat' : 'Ajouter un plat' }}
              </h3>
              <button
                type="button"
                class="h-10 w-10 rounded-2xl hover:bg-slate-100 grid place-items-center"
                (click)="closeDishModal()"
                aria-label="Close"
              >
                <i class="bi bi-x-lg"></i>
              </button>
            </div>

            <div class="p-6">
              <form [formGroup]="dishForm" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="md:col-span-1">
                  <label class="text-sm font-semibold text-slate-700">Nom du plat *</label>
                  <input
                    type="text"
                    class="mt-2 h-12 w-full rounded-2xl px-4 ring-1 ring-slate-200 focus:ring-2 focus:ring-violet-400 outline-none"
                    formControlName="name"
                  />
                </div>

                <div class="md:col-span-1">
                  <label class="text-sm font-semibold text-slate-700">Catégorie *</label>
                  <select
                    class="mt-2 h-12 w-full rounded-2xl px-4 ring-1 ring-slate-200 focus:ring-2 focus:ring-violet-400 outline-none bg-white"
                    formControlName="category"
                  >
                    <option value="">Sélectionner une catégorie</option>
                    @for (category of categories; track category.id) {
                      <option [value]="category.name">{{ category.name }}</option>
                    }
                  </select>
                </div>

                <div class="md:col-span-2">
                  <label class="text-sm font-semibold text-slate-700">Description *</label>
                  <textarea
                    rows="3"
                    class="mt-2 w-full rounded-2xl px-4 py-3 ring-1 ring-slate-200 focus:ring-2 focus:ring-violet-400 outline-none"
                    formControlName="description"
                  ></textarea>
                </div>

                <div class="md:col-span-1">
                  <label class="text-sm font-semibold text-slate-700">Prix (DH) *</label>
                  <input
                    type="number"
                    min="0"
                    class="mt-2 h-12 w-full rounded-2xl px-4 ring-1 ring-slate-200 focus:ring-2 focus:ring-violet-400 outline-none"
                    formControlName="price"
                  />
                </div>

                <div class="md:col-span-1">
                  <label class="text-sm font-semibold text-slate-700">URL de l'image</label>
                  <input
                    type="text"
                    class="mt-2 h-12 w-full rounded-2xl px-4 ring-1 ring-slate-200 focus:ring-2 focus:ring-violet-400 outline-none"
                    formControlName="image"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </form>
            </div>

            <div class="px-6 py-5 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                type="button"
                class="h-11 px-6 rounded-full text-sm font-semibold ring-1 ring-slate-200 bg-white hover:bg-slate-50 transition"
                (click)="closeDishModal()"
              >
                Annuler
              </button>

              <button
                type="button"
                class="h-11 px-6 rounded-full text-sm font-semibold text-white
                       bg-gradient-to-r from-indigo-500 to-fuchsia-500 hover:opacity-95 transition
                       inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                (click)="saveDish()"
                [disabled]="dishForm.invalid"
              >
                <i class="bi bi-check2"></i>
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      }

      <!-- Category Modal -->
      @if (showCategoryModal) {
        <div class="fixed inset-0 z-[60]">
          <div class="absolute inset-0 bg-black/50" (click)="closeCategoryModal()"></div>

          <div class="relative mx-auto mt-14 w-[92%] max-w-xl rounded-3xl bg-white shadow-xl ring-1 ring-slate-200 overflow-hidden">
            <div class="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
              <h3 class="text-lg font-extrabold text-slate-900">
                {{ editingCategory ? 'Modifier la catégorie' : 'Ajouter une catégorie' }}
              </h3>
              <button
                type="button"
                class="h-10 w-10 rounded-2xl hover:bg-slate-100 grid place-items-center"
                (click)="closeCategoryModal()"
                aria-label="Close"
              >
                <i class="bi bi-x-lg"></i>
              </button>
            </div>

            <div class="p-6">
              <form [formGroup]="categoryForm" class="space-y-4">
                <div>
                  <label class="text-sm font-semibold text-slate-700">Nom de la catégorie *</label>
                  <input
                    type="text"
                    class="mt-2 h-12 w-full rounded-2xl px-4 ring-1 ring-slate-200 focus:ring-2 focus:ring-violet-400 outline-none"
                    formControlName="name"
                  />
                </div>

                <div>
                  <label class="text-sm font-semibold text-slate-700">Icône *</label>
                  <div class="mt-3 flex flex-wrap gap-2">
                    @for (icon of iconOptions; track icon) {
                      <button
                        type="button"
                        class="h-11 w-11 rounded-2xl ring-1 ring-slate-200 bg-white hover:bg-slate-50 transition grid place-items-center text-lg"
                        [ngClass]="categoryForm.get('icon')?.value === icon ? 'ring-violet-400 bg-violet-50 text-violet-700' : ''"
                        (click)="categoryForm.patchValue({ icon: icon })"
                      >
                        <i class="bi {{ icon }}"></i>
                      </button>
                    }
                  </div>
                </div>
              </form>
            </div>

            <div class="px-6 py-5 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                type="button"
                class="h-11 px-6 rounded-full text-sm font-semibold ring-1 ring-slate-200 bg-white hover:bg-slate-50 transition"
                (click)="closeCategoryModal()"
              >
                Annuler
              </button>

              <button
                type="button"
                class="h-11 px-6 rounded-full text-sm font-semibold text-white
                       bg-gradient-to-r from-indigo-500 to-fuchsia-500 hover:opacity-95 transition
                       inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                (click)="saveCategory()"
                [disabled]="categoryForm.invalid"
              >
                <i class="bi bi-check2"></i>
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class AdminComponent implements OnInit {
  activeTab = 'dishes';

  dishes: Dish[] = [];
  orders: Order[] = [];
  reservations: Reservation[] = [];
  categories: Category[] = [];

  dishForm: FormGroup;
  categoryForm: FormGroup;

  editingDish: Dish | null = null;
  editingCategory: Category | null = null;
  showDishModal = false;
  showCategoryModal = false;

  iconOptions = [
    'bi-egg-fried', 'bi-cup-hot', 'bi-cake2', 'bi-cup-straw',
    'bi-fish', 'bi-basket', 'bi-emoji-smile', 'bi-tag'
  ];

  constructor(
    private restaurantService: RestaurantService,
    private fb: FormBuilder
  ) {
    this.dishForm = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      image: ['']
    });

    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      icon: ['bi-tag', Validators.required]
    });
  }

  ngOnInit(): void {
    this.restaurantService.dishes$.subscribe(dishes => (this.dishes = dishes));
    this.restaurantService.orders$.subscribe(orders => (this.orders = orders));
    this.restaurantService.reservations$.subscribe(reservations => (this.reservations = reservations));
    this.restaurantService.categories$.subscribe(categories => (this.categories = categories));
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  openAddDishModal(): void {
    this.editingDish = null;
    this.dishForm.reset({ price: 0 });
    this.showDishModal = true;
  }

  openEditDishModal(dish: Dish): void {
    this.editingDish = dish;
    this.dishForm.patchValue({
      name: dish.name,
      category: dish.category,
      description: dish.description,
      price: dish.price,
      image: dish.image
    });
    this.showDishModal = true;
  }

  closeDishModal(): void {
    this.showDishModal = false;
    this.editingDish = null;
  }

  saveDish(): void {
    if (!this.dishForm.valid) return;
    const dishData = { ...this.dishForm.value };

    if (!dishData.image) {
      dishData.image = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400';
    }

    if (this.editingDish) {
      this.restaurantService.updateDish({ ...dishData, id: this.editingDish.id });
    } else {
      this.restaurantService.addDish(dishData);
    }
    this.closeDishModal();
  }

  deleteDish(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce plat ?')) {
      this.restaurantService.deleteDish(id);
    }
  }

  openAddCategoryModal(): void {
    this.editingCategory = null;
    this.categoryForm.reset({ icon: 'bi-tag' });
    this.showCategoryModal = true;
  }

  openEditCategoryModal(category: Category): void {
    this.editingCategory = category;
    this.categoryForm.patchValue({
      name: category.name,
      icon: category.icon
    });
    this.showCategoryModal = true;
  }

  closeCategoryModal(): void {
    this.showCategoryModal = false;
    this.editingCategory = null;
  }

  saveCategory(): void {
    if (!this.categoryForm.valid) return;

    if (this.editingCategory) {
      this.restaurantService.updateCategory({ ...this.categoryForm.value, id: this.editingCategory.id });
    } else {
      this.restaurantService.addCategory(this.categoryForm.value);
    }
    this.closeCategoryModal();
  }

  deleteCategory(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      this.restaurantService.deleteCategory(id);
    }
  }

  updateOrderStatus(orderId: number, status: Order['status']): void {
    this.restaurantService.updateOrderStatus(orderId, status);
  }

  deleteOrder(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) {
      this.restaurantService.deleteOrder(id);
    }
  }

  updateReservationStatus(reservationId: number, status: Reservation['status']): void {
    this.restaurantService.updateReservationStatus(reservationId, status);
  }

  deleteReservation(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette réservation ?')) {
      this.restaurantService.deleteReservation(id);
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  get totalRevenue(): number {
    return this.orders.reduce((sum, order) => sum + order.total, 0);
  }

  get confirmedOrders(): number {
    return this.orders.filter(o => o.status === 'confirmed').length;
  }

  get pendingReservations(): number {
    return this.reservations.filter(r => r.status === 'pending').length;
  }

  statusPillClass(status: Order['status']): string {
    if (status === 'confirmed') return 'bg-emerald-100 text-emerald-700';
    if (status === 'pending') return 'bg-amber-100 text-amber-800';
    return 'bg-slate-100 text-slate-700';
  }

  reservationPillClass(status: Reservation['status']): string {
    if (status === 'confirmed') return 'bg-emerald-100 text-emerald-700';
    if (status === 'pending') return 'bg-amber-100 text-amber-800';
    return 'bg-rose-100 text-rose-700';
  }
}
