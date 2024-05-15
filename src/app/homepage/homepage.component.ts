import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatListModule } from '@angular/material/list';
import { RestaurantService } from '../services/restaurant.service';
import { Kitchen, Restaurant } from '../models/restaurant';
import { KeycloakOperationService } from '../services/keycloak.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
	selector: 'app-homepage',
	standalone: true,
	imports: [MatSnackBarModule, CommonModule, FormsModule, MatListModule, MatButtonModule, MatMenuModule, MatIconModule, MatCheckboxModule],
	templateUrl: './homepage.component.html',
	styleUrl: './homepage.component.scss'
})
export class HomepageComponent implements OnInit {
	restaurants: Restaurant[] = [];
	filteredRestaurants: Restaurant[] = [];
	searchText: string = '';
	userProfile: any | null = null;
	isTooltipVisible = false;
	kitchens: Kitchen[] = [];

	constructor(
		private restaurantService: RestaurantService,
		private keyCloakService: KeycloakOperationService,
		private snackBar: MatSnackBar
	) { }

	ngOnInit(): void {
		this.getAllRestaurants();
		this.getCurrentlyUsedKitchens();
		this.keyCloakService.getUserProfile().then((data: any) => {
			this.userProfile = data;
			console.log(this.userProfile);
		});
	}

	logout() {
		this.keyCloakService.logout();
	}

	getCurrentlyUsedKitchens() {
		this.restaurantService.getCurrentlyUsedKitchens().subscribe({
			next: (kitchens: Kitchen[]) => {
				this.kitchens = kitchens;
			},
			error: (error: any) => {
				this.handleError(error.error);
			}
		});
	}

	getAllRestaurants() {
		this.restaurantService.getAllRestaurants().subscribe({
			next: (restaurants: Restaurant[]) => {
				this.restaurants = restaurants;
				this.filteredRestaurants = Object.assign([], restaurants);
				this.updateFilteredRestaurants();
			},
			error: (error: any) => {
				this.handleError(error.error);
			}
		});
	}

	private handleError(error: any) {
		this.displayError(error.code + ' ' + error.reason + '. ' + error.message);
	}

	private displayError(message: string) {
		this.snackBar.open(message, 'Close', { duration: 5000 });
	}

	public onSearchChange(event: any) {
		this.searchText = event.target.value;
		this.updateFilteredRestaurants();
	}

	public updateFilteredRestaurants() {
		if (!this.searchText) {
			this.filteredRestaurants = Object.assign([], this.restaurants);
		}

		const searchText = this.searchText.toLowerCase();
		this.filteredRestaurants = this.restaurants.filter((restaurant) => {
			return restaurant.name.toLowerCase().includes(searchText) || restaurant.city.toLowerCase().includes(searchText) || restaurant.street.toLowerCase().includes(searchText);
		});
	}
}
