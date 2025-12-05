import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- HERO -->
    <section class="relative mx-3 md:mx-6 bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-white rounded-b-3xl overflow-hidden">
      <div class="max-w-6xl mx-auto px-4 md:px-6 pt-14 pb-8 text-center">
        <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight">Le Gourmet</h1>
        <p class="mt-2 text-base md:text-lg text-white/90">Savourez l'excellence</p>

        <div class="mt-10">
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200"
            alt="Restaurant interior"
            class="w-full h-56 md:h-80 object-cover rounded-2xl shadow-lg ring-1 ring-white/20"
          />
        </div>
      </div>
    </section>

    <!-- INFO CARDS -->
    <section class="py-10">
      <div class="max-w-6xl mx-auto px-4 md:px-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="h-full rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 p-6 text-center">
            <div class="mx-auto h-11 w-11 rounded-2xl bg-pink-50 text-pink-600 grid place-items-center text-xl">
              <i class="bi bi-geo-alt-fill"></i>
            </div>
            <div class="mt-3 text-base font-semibold text-slate-900">Adresse</div>
            <div class="mt-1 text-sm text-slate-600">Supmti - OUJDA. Maroc</div>
          </div>

          <div class="h-full rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 p-6 text-center">
            <div class="mx-auto h-11 w-11 rounded-2xl bg-pink-50 text-pink-600 grid place-items-center text-xl">
              <i class="bi bi-telephone-fill"></i>
            </div>
            <div class="mt-3 text-base font-semibold text-slate-900">Contact</div>
            <div class="mt-1 text-sm text-slate-600">+212 7 01 02 03 04</div>
          </div>

          <div class="h-full rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 p-6 text-center">
            <div class="mx-auto h-11 w-11 rounded-2xl bg-pink-50 text-pink-600 grid place-items-center text-xl">
              <i class="bi bi-clock-fill"></i>
            </div>
            <div class="mt-3 text-base font-semibold text-slate-900">Horaires</div>
            <div class="mt-1 text-sm text-slate-600">Lun - Ven: 11h00 - 23h00</div>
            <div class="text-sm text-slate-600">Sam - Dim: 10h00 - 00h00</div>
          </div>
        </div>
      </div>
    </section>

    <!-- ACTION CARDS -->
    <section class="pb-12">
      <div class="max-w-6xl mx-auto px-4 md:px-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          @for (feature of features; track feature.title) {
            <div class="h-full rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 p-7 text-center transition hover:-translate-y-1">
              <div class="mx-auto h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 grid place-items-center text-2xl">
                <i class="bi {{ feature.icon }}"></i>
              </div>

              <div class="mt-3 text-lg font-semibold text-slate-900">{{ feature.title }}</div>
              <div class="mt-1 text-sm text-slate-600">{{ feature.description }}</div>

              <a
                [routerLink]="feature.link"
                class="mt-5 inline-flex items-center justify-center rounded-2xl px-5 py-2.5 font-semibold text-white
                       bg-gradient-to-r from-indigo-500 to-fuchsia-500 shadow-sm hover:opacity-95 active:scale-[0.99] transition"
              >
                {{ feature.buttonText }}
              </a>
            </div>
          }
        </div>
      </div>
    </section>
  `
})
export class HomeComponent {
  features = [
    {
      icon: 'bi-book-half',
      title: 'Notre Menu',
      description: 'Découvrez nos plats délicieux',
      link: '/menu',
      buttonText: 'Voir le Menu'
    },
    {
      icon: 'bi-cart-check',
      title: 'Commander',
      description: 'Passez votre commande en ligne',
      link: '/order',
      buttonText: 'Commander'
    },
    {
      icon: 'bi-calendar-event',
      title: 'Réserver',
      description: 'Réservez votre table',
      link: '/reservation',
      buttonText: 'Réserver'
    }
  ];
}
