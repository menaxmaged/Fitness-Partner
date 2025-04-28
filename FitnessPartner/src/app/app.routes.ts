import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './public/about/about.component';
import { CheckoutComponent } from './public/checkout/checkout.component';
import { HomeComponent } from './public/home/home.component';
import { CartComponent } from './public/cart/cart.component';
import { ExercisesComponent } from './public/exercises/exercises.component';
import { NutritionComponent } from './public/nutrition/nutrition.component';
import { ProductsComponent } from './public/products/products.component';
import { ProductDetailsComponent } from './public/product-details/product-details.component';
import { TrainersComponent } from './public/trainers/trainers.component';
import { NotFoundComponent } from './public/not-found/not-found.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { ProfileComponent } from './profile/profile.component';
import { ContactComponent } from './public/contact/contact.component';
import { TrainerDetailsComponent } from './public/trainer-details/trainer-details.component';
import { FavoritesComponent } from './public/favorites/favorites.component';
import { CheckoutConfirmationComponent } from './public/checkout-confirmation/checkout-confirmation.component';
import { OrdersComponent } from './profile/orders/orders.component';
import { PasswordComponent } from './profile/password/password.component';
import { SettingsComponent } from './profile/settings/settings.component';
import { AuthGuard } from './auth/auth.guard';
import { NutritionDetailsComponent } from './public/nutrition-details/nutrition-details.component';
import { ExercisesHomeComponent } from './exercises-home/exercises-home.component';
import { ExercisesGymComponent } from './exercises-gym/exercises-gym.component';
import { MuscleExerciseComponent } from './muscle-exercise/muscle-exercise.component';
import { ExerciseDetailComponent } from './exercise-detail/exercise-detail.component';
import { NgModule } from '@angular/core';
import { MealsPlannerComponent } from './public/meals-planner/meals-planner.component';
import { WarmUpComponent } from './warm-up/warm-up.component';
import { ForgotPasswordComponent } from './public/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './public/reset-password/reset-password.component';

export const routes: Routes = [
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'cart', component: CartComponent },
  { path: 'favorites', component: FavoritesComponent },
  { path: 'checkout', component: CheckoutComponent },
  {
    path: 'checkout-confirmation',
    component: CheckoutConfirmationComponent,
    canActivate: [AuthGuard],
  },
  { path: 'exercises', component: ExercisesComponent },
  { path: 'exercises/home', component: ExercisesHomeComponent },
  { path: 'exercises/gym', component: ExercisesGymComponent },
  { path: 'exercises/warm', component: WarmUpComponent },
  { path: 'exercises/:type/:muscle', component: MuscleExerciseComponent },
  {
    path: 'exercises/:type/:muscle/:exercise',
    component: ExerciseDetailComponent,
  },

  { path: 'nutrition', component: NutritionComponent },
  { path: 'mealsPlanner', component: MealsPlannerComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'products/:id', component: ProductDetailsComponent },
  { path: 'trainers', component: TrainersComponent },
  { path: 'trainers/:id', component: TrainerDetailsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },

  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'orders', component: OrdersComponent },
      { path: 'passwords', component: PasswordComponent },
      { path: 'settings', component: SettingsComponent },
      { path: '', redirectTo: 'settings', pathMatch: 'full' },
    ],
  },
  { path: 'forgotPassword', component: ForgotPasswordComponent },
  { path: 'resetPassword', component: ResetPasswordComponent },

  { path: 'nutrient/:id', component: NutritionDetailsComponent },
  { path: 'contactus', component: ContactComponent },

  { path: '**', component: NotFoundComponent },
];

export const appRouting = RouterModule.forRoot(routes, {
  onSameUrlNavigation: 'reload',
});

// If you're using NgModule:
@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      onSameUrlNavigation: 'reload',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
