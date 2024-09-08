import { Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { AuthGuard } from './guard/auth.guard';
import { AddRestaurantComponent } from './add-restaurant/add-restaurant.component';
import { CustomRestaurantDetailsComponent } from './custom-restaurant-details/custom-restaurant-details.component';
import { LieferandoRestaurantDetailsComponent } from './lieferando-restaurant-details/lieferando-restaurant-details.component';
import { addressGuard } from './guard/address.guard';
import { AddressLandingpageComponent } from './address-landingpage/address-landingpage.component';
import { InvitationComponent } from './groups/invitation/invitation.component';

export const routes: Routes = [
	{ path: '', component: HomepageComponent, canActivate: [AuthGuard, addressGuard] },
	{ path: 'groups/join/:code', component: InvitationComponent, canActivate: [AuthGuard] },
	{ path: 'address', component: AddressLandingpageComponent, canActivate: [AuthGuard] },
	{ path: 'add-restaurant', component: AddRestaurantComponent, canActivate: [AuthGuard, addressGuard] },
	{ path: 'custom-restaurant-details/:id', component: CustomRestaurantDetailsComponent, canActivate: [AuthGuard, addressGuard] },
	{ path: 'lieferando-restaurant-details/:id', component: LieferandoRestaurantDetailsComponent, canActivate: [AuthGuard, addressGuard] },
	{ path: '**', redirectTo: '' },
];
