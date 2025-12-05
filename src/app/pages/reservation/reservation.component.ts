import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { RestaurantService } from '../../services/restaurant.service';

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="max-w-3xl mx-auto px-4 md:px-6 py-10">
      <div class="text-center mb-8">
        <h1 class="text-3xl md:text-4xl font-extrabold text-slate-900">Réservation</h1>
        <p class="mt-3 text-slate-600">
          Réservez votre table pour une expérience gastronomique inoubliable
        </p>
      </div>

      @if (!reservationConfirmed) {
        <div class="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 overflow-hidden">
          <div class="p-6 md:p-8">
            <form [formGroup]="reservationForm" (ngSubmit)="submitReservation()" class="space-y-5">
              <!-- Row 1 -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Name -->
                <div>
                  <label class="text-sm font-medium text-slate-700">Nom complet *</label>
                  <div class="mt-1 flex items-center rounded-2xl bg-white ring-1 overflow-hidden
                              focus-within:ring-2 focus-within:ring-indigo-400"
                       [class.ring-slate-200]="!(reservationForm.get('name')?.invalid && reservationForm.get('name')?.touched)"
                       [class.ring-rose-300]="reservationForm.get('name')?.invalid && reservationForm.get('name')?.touched">
                    <span class="px-4 text-slate-500">
                      <i class="bi bi-person"></i>
                    </span>
                    <input
                      type="text"
                      formControlName="name"
                      placeholder="Votre nom"
                      class="h-11 w-full pr-4 text-sm outline-none"
                    />
                  </div>

                  @if (reservationForm.get('name')?.invalid && reservationForm.get('name')?.touched) {
                    <p class="mt-1 text-xs text-rose-600">
                      Le nom est requis (minimum 2 caractères)
                    </p>
                  }
                </div>

                <!-- Email -->
                <div>
                  <label class="text-sm font-medium text-slate-700">Email *</label>
                  <div class="mt-1 flex items-center rounded-2xl bg-white ring-1 overflow-hidden
                              focus-within:ring-2 focus-within:ring-indigo-400"
                       [class.ring-slate-200]="!(reservationForm.get('email')?.invalid && reservationForm.get('email')?.touched)"
                       [class.ring-rose-300]="reservationForm.get('email')?.invalid && reservationForm.get('email')?.touched">
                    <span class="px-4 text-slate-500">
                      <i class="bi bi-envelope"></i>
                    </span>
                    <input
                      type="email"
                      formControlName="email"
                      placeholder="votre@email.com"
                      class="h-11 w-full pr-4 text-sm outline-none"
                    />
                  </div>

                  @if (reservationForm.get('email')?.invalid && reservationForm.get('email')?.touched) {
                    <p class="mt-1 text-xs text-rose-600">Email invalide</p>
                  }
                </div>
              </div>

              <!-- Row 2 -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Phone -->
                <div>
                  <label class="text-sm font-medium text-slate-700">Téléphone *</label>
                  <div class="mt-1 flex items-center rounded-2xl bg-white ring-1 overflow-hidden
                              focus-within:ring-2 focus-within:ring-indigo-400"
                       [class.ring-slate-200]="!(reservationForm.get('phone')?.invalid && reservationForm.get('phone')?.touched)"
                       [class.ring-rose-300]="reservationForm.get('phone')?.invalid && reservationForm.get('phone')?.touched">
                    <span class="px-4 text-slate-500">
                      <i class="bi bi-telephone"></i>
                    </span>
                    <input
                      type="tel"
                      formControlName="phone"
                      placeholder="+212 7 01 02 03 05"
                      class="h-11 w-full pr-4 text-sm outline-none"
                    />
                  </div>

                  @if (reservationForm.get('phone')?.invalid && reservationForm.get('phone')?.touched) {
                    <p class="mt-1 text-xs text-rose-600">Numéro de téléphone invalide</p>
                  }
                </div>

                <!-- People -->
                <div>
                  <label class="text-sm font-medium text-slate-700">Nombre de personnes *</label>
                  <div class="mt-1 flex items-center rounded-2xl bg-white ring-1 overflow-hidden
                              focus-within:ring-2 focus-within:ring-indigo-400"
                       [class.ring-slate-200]="!(reservationForm.get('numberOfPeople')?.invalid && reservationForm.get('numberOfPeople')?.touched)"
                       [class.ring-rose-300]="reservationForm.get('numberOfPeople')?.invalid && reservationForm.get('numberOfPeople')?.touched">
                    <span class="px-4 text-slate-500">
                      <i class="bi bi-people"></i>
                    </span>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      formControlName="numberOfPeople"
                      class="h-11 w-full pr-4 text-sm outline-none"
                    />
                  </div>

                  @if (reservationForm.get('numberOfPeople')?.invalid && reservationForm.get('numberOfPeople')?.touched) {
                    <p class="mt-1 text-xs text-rose-600">Entre 1 et 20 personnes</p>
                  }
                </div>
              </div>

              <!-- Row 3 -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Date -->
                <div>
                  <label class="text-sm font-medium text-slate-700">Date *</label>
                  <div class="mt-1 flex items-center rounded-2xl bg-white ring-1 overflow-hidden
                              focus-within:ring-2 focus-within:ring-indigo-400"
                       [class.ring-slate-200]="!(reservationForm.get('date')?.invalid && reservationForm.get('date')?.touched)"
                       [class.ring-rose-300]="reservationForm.get('date')?.invalid && reservationForm.get('date')?.touched">
                    <span class="px-4 text-slate-500">
                      <i class="bi bi-calendar"></i>
                    </span>
                    <input
                      type="date"
                      [min]="minDate"
                      formControlName="date"
                      class="h-11 w-full pr-4 text-sm outline-none"
                    />
                  </div>

                  @if (reservationForm.get('date')?.hasError('required') && reservationForm.get('date')?.touched) {
                    <p class="mt-1 text-xs text-rose-600">La date est requise</p>
                  }
                  @if (reservationForm.get('date')?.hasError('pastDate')) {
                    <p class="mt-1 text-xs text-rose-600">La date doit être dans le futur</p>
                  }
                </div>

                <!-- Time -->
                <div>
                  <label class="text-sm font-medium text-slate-700">Heure *</label>
                  <div class="mt-1 flex items-center rounded-2xl bg-white ring-1 overflow-hidden
                              focus-within:ring-2 focus-within:ring-indigo-400"
                       [class.ring-slate-200]="!(reservationForm.get('time')?.invalid && reservationForm.get('time')?.touched)"
                       [class.ring-rose-300]="reservationForm.get('time')?.invalid && reservationForm.get('time')?.touched">
                    <span class="px-4 text-slate-500">
                      <i class="bi bi-clock"></i>
                    </span>
                    <select
                      formControlName="time"
                      class="h-11 w-full pr-10 text-sm outline-none bg-white"
                    >
                      <option value="">Choisir une heure</option>
                      @for (time of getAvailableTimes(); track time) {
                        <option [value]="time">{{ time }}</option>
                      }
                    </select>
                  </div>

                  @if (reservationForm.get('time')?.invalid && reservationForm.get('time')?.touched) {
                    <p class="mt-1 text-xs text-rose-600">L'heure est requise</p>
                  }
                </div>
              </div>

              <div class="pt-2 border-t border-slate-100"></div>

              <button
                type="submit"
                class="w-full inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 font-semibold text-white
                       bg-gradient-to-r from-indigo-500 to-fuchsia-500 shadow-sm hover:opacity-95 active:scale-[0.99]
                       disabled:opacity-50 disabled:cursor-not-allowed transition"
                [disabled]="reservationForm.invalid"
              >
                <i class="bi bi-calendar-check"></i>
                Confirmer la réservation
              </button>
            </form>
          </div>
        </div>

        <!-- Useful info -->
        <div class="mt-4 rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 p-6">
          <h2 class="text-base font-semibold text-slate-900 inline-flex items-center gap-2">
            <span class="h-9 w-9 rounded-2xl bg-amber-50 text-amber-700 grid place-items-center">
              <i class="bi bi-info-circle"></i>
            </span>
            Informations utiles
          </h2>

          <ul class="mt-4 space-y-2 text-sm text-slate-700 list-disc pl-5">
            <li>Les réservations sont confirmées par email sous 24h</li>
            <li>Pour les groupes de plus de 10 personnes, contactez-nous directement</li>
            <li>Annulation gratuite jusqu'à 2h avant l'heure de réservation</li>
          </ul>
        </div>
      } @else {
        <!-- Confirmation -->
        <div class="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 p-10 text-center">
          <div class="mx-auto h-14 w-14 rounded-2xl bg-emerald-50 text-emerald-600 grid place-items-center text-2xl">
            <i class="bi bi-check-circle-fill"></i>
          </div>

          <h2 class="mt-4 text-2xl font-extrabold text-slate-900">Réservation confirmée !</h2>
          <p class="mt-2 text-slate-600">
            Votre réservation <span class="font-semibold text-slate-900">#{{ reservationId }}</span> a été enregistrée.<br>
            Un email de confirmation vous sera envoyé sous peu.
          </p>

          <div class="mt-6 flex flex-col sm:flex-row gap-2 justify-center">
            <a
              routerLink="/"
              class="inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-2.5 font-semibold text-white
                     bg-gradient-to-r from-indigo-500 to-fuchsia-500 shadow-sm hover:opacity-95 active:scale-[0.99] transition"
            >
              <i class="bi bi-house"></i>
              Retour à l'accueil
            </a>

            <button
              type="button"
              class="inline-flex items-center justify-center rounded-2xl px-5 py-2.5 font-semibold text-slate-700
                     ring-1 ring-slate-200 bg-white hover:bg-slate-50 transition"
              (click)="closeConfirmation()"
            >
              Nouvelle réservation
            </button>
          </div>
        </div>
      }
    </div>
  `
})
export class ReservationComponent {
  reservationForm: FormGroup;
  reservationConfirmed = false;
  reservationId = 0;
  minDate: string;

  constructor(
    private restaurantService: RestaurantService,
    private fb: FormBuilder
  ) {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];

    this.reservationForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9+\s-]{8,15}$/)]],
      numberOfPeople: [2, [Validators.required, Validators.min(1), Validators.max(20)]],
      date: ['', [Validators.required, this.futureDateValidator.bind(this)]],
      time: ['', Validators.required]
    });
  }

  futureDateValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;

    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return selectedDate >= today ? null : { pastDate: true };
  }

  getAvailableTimes(): string[] {
    const times: string[] = [];
    for (let hour = 11; hour <= 22; hour++) {
      const h = hour.toString().padStart(2, '0');
      times.push(`${h}:00`);
      times.push(`${h}:30`);
    }
    return times;
  }

  submitReservation(): void {
    if (this.reservationForm.valid) {
      const formValue = this.reservationForm.value;

      const reservation = this.restaurantService.addReservation({
        name: formValue.name,
        email: formValue.email,
        phone: formValue.phone,
        numberOfPeople: formValue.numberOfPeople,
        date: new Date(formValue.date),
        time: formValue.time
      });

      this.reservationId = reservation.id;
      this.reservationConfirmed = true;
      this.reservationForm.reset({ numberOfPeople: 2 });
    }
  }

  closeConfirmation(): void {
    this.reservationConfirmed = false;
  }
}
