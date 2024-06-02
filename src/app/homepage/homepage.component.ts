import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatListModule } from '@angular/material/list';
import { RestaurantService } from '../services/restaurant.service';
import { Kitchen, Restaurant, SubKitchen } from '../models/restaurant';
import { ImageService } from '../services/image.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { HeaderComponent } from '../header/header.component';

@Component({
	selector: 'app-homepage',
	standalone: true,
	imports: [MatSnackBarModule, CommonModule, FormsModule, MatListModule, MatIconModule, MatCheckboxModule, MatExpansionModule, HeaderComponent],
	templateUrl: './homepage.component.html',
	styleUrl: './homepage.component.scss'
})
export class HomepageComponent implements OnInit {
	restaurants: Restaurant[] = [];
	filteredRestaurants: Restaurant[] = [];
	searchText: string = '';
	isTooltipVisible = false;
	kitchens: Kitchen[] = [];
	kitchenFilter: any = {};

	constructor(
		private restaurantService: RestaurantService,
		private imageService: ImageService,
		private snackBar: MatSnackBar
	) { }

	ngOnInit(): void {
		this.getAllRestaurants();
		this.getCurrentlyUsedKitchens();
	}

	getSubkitchenDescriptions(subkitchens: SubKitchen[]): string {
		return subkitchens.map(sk => sk.description).join(', ');
	}

	updateAllComplete(kitchenId: number, subkitchenId: number) {
		this.kitchenFilter[kitchenId].checked = Object.values(this.kitchenFilter[kitchenId].subkitchens).every((subkitchen: any) => subkitchen.checked);

		this.updateFilteredRestaurants();
	}

	updateSubkitchenRestaurantFilter(kitchenId: number | Array<number>, subkitchenId?: number) {
		const kitchenIds = Array.isArray(kitchenId) ? kitchenId : [kitchenId];

		for (const kitchenId of kitchenIds) {
			const kitchen = this.kitchenFilter[kitchenId];
			const subkitchenIds = subkitchenId ? [subkitchenId] : Object.keys(kitchen.subkitchens);

			for (const subkitchenId of subkitchenIds) {
				const checked = kitchen.subkitchens[subkitchenId].checked;
	
				if (checked) {
					const restaurantsToAdd = this.restaurants.filter((restaurant) => {
						return restaurant.subkitchens.find(sk => sk.id == subkitchenId);
					});
	
					for (const restaurantToAdd of restaurantsToAdd) {
						if (!this.filteredRestaurants.includes(restaurantToAdd)) {
							this.filteredRestaurants.push(restaurantToAdd);
						}
					}
				} else {
					const allSubKitchens = Object.values(this.kitchenFilter).map((k: any) => k.subkitchens).reduce((prev, curr) => {
						return {
							...prev,
							...curr
						};
					}, {});
	
					this.filteredRestaurants = this.filteredRestaurants.filter((restaurant) => {
						return !restaurant.subkitchens.every(sk => {
							return !allSubKitchens[sk.id].checked;
						});
					});
				}
			}
		}

		this.filteredRestaurants.sort((a, b) => a.name.localeCompare(b.name));
	}

	someChecked(kitchenId: number): boolean {
		return Object.values(this.kitchenFilter[kitchenId].subkitchens).filter((subkitchen: any) => subkitchen.checked).length > 0 && !this.kitchenFilter[kitchenId].checked;
	}

	setAll(kitchenId: number, checked: boolean) {
		this.kitchenFilter[kitchenId].checked = checked;
		for (const subkitchen in this.kitchenFilter[kitchenId].subkitchens) {
			this.kitchenFilter[kitchenId].subkitchens[subkitchen].checked = checked;
		}

		this.updateFilteredRestaurants();
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
		this.filteredRestaurants = Object.assign([], this.restaurants);
		this.updateSubkitchenRestaurantFilter(this.kitchens.map((k) => k.id));

		if (!this.searchText) {
			return;
		}

		const searchText = this.searchText.toLowerCase();
		this.filteredRestaurants = this.filteredRestaurants.filter((restaurant) => {
			return restaurant.name.toLowerCase().includes(searchText)
				|| restaurant.city.toLowerCase().includes(searchText)
				|| restaurant.street.toLowerCase().includes(searchText)
				|| restaurant.subkitchens.join(' ').toLowerCase().includes(searchText);
		});

		this.filteredRestaurants.sort((a, b) => a.name.localeCompare(b.name));
	}
}
