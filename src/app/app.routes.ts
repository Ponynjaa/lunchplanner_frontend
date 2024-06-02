import { Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { AuthGuard } from './guard/auth.guard';
import { AddRestaurantComponent } from './add-restaurant/add-restaurant.component';

export const routes: Routes = [
	{ path: '', component: HomepageComponent, canActivate: [AuthGuard] },
	{ path: 'add-restaurant', component: AddRestaurantComponent, canActivate: [AuthGuard] },
	{ path: '**', redirectTo: '' },
];
