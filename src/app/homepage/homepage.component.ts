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
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
	selector: 'app-homepage',
	standalone: true,
	imports: [MatSnackBarModule, CommonModule, FormsModule, MatListModule, MatButtonModule, MatMenuModule, MatIconModule, MatCheckboxModule, MatExpansionModule],
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
	kitchenFilter: any = {};

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

	updateAllComplete(kitchenId: number) {
		this.kitchenFilter[kitchenId].checked = Object.values(this.kitchenFilter[kitchenId].subkitchens).every((subkitchen: any) => subkitchen.checked);
	}

	someChecked(kitchenId: number): boolean {
		return Object.values(this.kitchenFilter[kitchenId].subkitchens).filter((subkitchen: any) => subkitchen.checked).length > 0 && !this.kitchenFilter[kitchenId].checked;
	}

	setAll(kitchenId: number, checked: boolean) {
		this.kitchenFilter[kitchenId].checked = checked;
		for (const subkitchen in this.kitchenFilter[kitchenId].subkitchens) {
			this.kitchenFilter[kitchenId].subkitchens[subkitchen].checked = checked;
		}
	}

	getCurrentlyUsedKitchens() {
		this.restaurantService.getCurrentlyUsedKitchens().subscribe({
			next: (kitchens: Kitchen[]) => {
				this.kitchens = kitchens;
				this.kitchenFilter = kitchens.reduce((prev: any, curr) => {
					prev[curr.id] = {
						description: curr.description,
						checked: true,
						subkitchens: curr.subkitchens.reduce((prev: any, curr) => {
							prev[curr.id] = {
								description: curr.description,
								checked: true
							};

							return prev;
						}, {})
					};

					return prev;
				}, {});
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
			return restaurant.name.toLowerCase().includes(searchText)
				|| restaurant.city.toLowerCase().includes(searchText)
				|| restaurant.street.toLowerCase().includes(searchText)
				|| restaurant.subkitchens.join(' ').toLowerCase().includes(searchText);
		});
	}
}
