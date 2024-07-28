import { Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { AuthGuard } from './guard/auth.guard';
import { AddRestaurantComponent } from './add-restaurant/add-restaurant.component';
import { CustomRestaurantDetailsComponent } from './custom-restaurant-details/custom-restaurant-details.component';
import { LieferandoRestaurantDetailsComponent } from './lieferando-restaurant-details/lieferando-restaurant-details.component';

export const routes: Routes = [
	{ path: '', component: HomepageComponent, canActivate: [AuthGuard] },
	{ path: 'add-restaurant', component: AddRestaurantComponent, canActivate: [AuthGuard] },
	{ path: 'custom-restaurant-details/:id', component: CustomRestaurantDetailsComponent, canActivate: [AuthGuard] },
	{ path: 'lieferando-restaurant-details/:id', component: LieferandoRestaurantDetailsComponent, canActivate: [AuthGuard] },
	{ path: '**', redirectTo: '' },
];
