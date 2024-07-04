import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RestaurantService } from '../services/restaurant.service';
import { CustomRestaurant, DeliveryCosts, DeliveryMethods, ETA, Kitchen, LieferandoRestaurant, Restaurant, SubKitchen } from '../models/restaurant';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HeaderComponent } from '../header/header.component';
import { GroupByPipe } from '../pipes/group-by.pipe';
import { WebSocketService } from '../services/websocket.service';
import { KeycloakOperationService } from '../services/keycloak.service';
import { UserProfile } from '../models/user';

@Component({
	selector: 'app-homepage',
	standalone: true,
	imports: [MatSnackBarModule, CommonModule, FormsModule, MatIconModule, MatCheckboxModule, MatExpansionModule, HeaderComponent, GroupByPipe, MatTooltipModule],
	templateUrl: './homepage.component.html',
	styleUrl: './homepage.component.scss'
})
export class HomepageComponent implements OnInit {
	customRestaurants: CustomRestaurant[] = [];
	filteredCustomRestaurants: CustomRestaurant[] = [];
	lieferandoRestaurants: LieferandoRestaurant[] = [];
	filteredLieferandoRestaurants: LieferandoRestaurant[] = [];
	searchText: string = '';
	isTooltipVisible = false;
	kitchens: Kitchen[] = [];
	kitchenFilter: any = {};
	loggedInUser?: UserProfile;

	constructor(
		private restaurantService: RestaurantService,
		private keycloakService: KeycloakOperationService,
		private webSocketService: WebSocketService,
		private snackBar: MatSnackBar
	) { }

	async ngOnInit(): Promise<void> {
		this.loggedInUser = await this.keycloakService.getUserProfile();
		await this.getAllRestaurants();
		this.getCurrentlyUsedKitchens();

		const token = await this.keycloakService.getToken();
		this.webSocketService.connect(token).subscribe({
			next: (value) => {
				console.log(value);
				const restaurantsToUpdate = [];
				if (value.lieferando) {
					restaurantsToUpdate.push(this.lieferandoRestaurants.find((restaurant) => restaurant.id === value.restaurantId));
					restaurantsToUpdate.push(this.filteredLieferandoRestaurants.find((restaurant) => restaurant.id === value.restaurantId));
				} else {
					restaurantsToUpdate.push(this.customRestaurants.find((restaurant) => restaurant.id === value.restaurantId));
					restaurantsToUpdate.push(this.filteredCustomRestaurants.find((restaurant) => restaurant.id === value.restaurantId));
				}

				for (const restaurant of restaurantsToUpdate) {
					if (!restaurant) {
						continue;
					}

					restaurant.votes = value.votes;
					restaurant.upvotes = value.upvotes;
					restaurant.downvotes = value.downvotes;
				}

				this.sortRestaurants();
			},
			error: (error) => {
				console.error(error);
				this.handleError(error);
			}
		});
	}

	isActive(votes: any[]) {
		return votes.some((vote) => vote.id === this.loggedInUser?.id);
	}

	getSubkitchenDescriptions(subkitchens: SubKitchen[]): string {
		return subkitchens.map(sk => sk.description_de).join(', ');
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
					const customRestaurantsToAdd = this.customRestaurants.filter((restaurant) => {
						return restaurant.subkitchens.find(sk => sk.id == subkitchenId);
					});
	
					for (const restaurantToAdd of customRestaurantsToAdd) {
						if (!this.filteredCustomRestaurants.includes(restaurantToAdd)) {
							this.filteredCustomRestaurants.push(restaurantToAdd);
						}
					}

					const lieferandoRestaurantsToAdd = this.lieferandoRestaurants.filter((restaurant) => {
						return restaurant.subkitchens.find(sk => sk.id == subkitchenId);
					});
	
					for (const restaurantToAdd of lieferandoRestaurantsToAdd) {
						if (!this.filteredLieferandoRestaurants.includes(restaurantToAdd)) {
							this.filteredLieferandoRestaurants.push(restaurantToAdd);
						}
					}
				} else {
					const allSubKitchens = Object.values(this.kitchenFilter).map((k: any) => k.subkitchens).reduce((prev, curr) => {
						return {
							...prev,
							...curr
						};
					}, {});
	
					this.filteredCustomRestaurants = this.filteredCustomRestaurants.filter((restaurant) => {
						return !restaurant.subkitchens.every(sk => {
							return !allSubKitchens[sk.id].checked;
						});
					});

					this.filteredLieferandoRestaurants = this.filteredLieferandoRestaurants.filter((restaurant) => {
						return !restaurant.subkitchens.every(sk => {
							return !allSubKitchens[sk.id].checked;
						});
					});
				}
			}
		}

		this.sortRestaurants();
	}

	getGroupName(groupKey: string) {
		if (groupKey === 'open') {
			return 'Geöffnet';
		} else if (groupKey === 'opens_soon') {
			return 'Öffnet demnächst';
		} else {
			return 'Geschlossen';
		}
	}

	getEta(restaurant: LieferandoRestaurant) {
		const orderAhead = restaurant.deliveryMethods.delivery.orderAhead || restaurant.deliveryMethods.pickup.orderAhead;
		if (orderAhead) {
			const parts = orderAhead.split(':');
			parts.pop();
			const display = parts.join(':');
			return `Ab ${display}`;
		}

		if (this.isClosed(restaurant)) {
			return 'Vorübergehend geschlossen';
		}

		return `${restaurant.eta.min}-${restaurant.eta.max} min`;
	}

	isClosed(restaurant: LieferandoRestaurant) {
		return !restaurant.deliveryMethods.pickup.open && !restaurant.deliveryMethods.delivery.open;
	}

	getDeliveryMethods(deliveryMethods?: DeliveryMethods|CustomRestaurant) {
		if (!deliveryMethods) {
			return '';
		}

		const delivery = typeof deliveryMethods.delivery === 'boolean' ? deliveryMethods.delivery : deliveryMethods.delivery.open;
		const pickup = typeof deliveryMethods.pickup === 'boolean' ? deliveryMethods.pickup : deliveryMethods.pickup.open;
		if (delivery && pickup) {
			return 'Lieferung & Abholung';
		} else if (delivery) {
			return 'Nur Lieferung';
		} else if (pickup) {
			return 'Nur Abholung';
		}

		return 'Geschlossen';
	}

	getDeliveryCosts(deliveryCosts: DeliveryCosts) {
		const costs = deliveryCosts.costs.costs;
		if (costs === 0) {
			return 'Kostenlos';
		}

		return `${this.formatNumber(costs / 100)}€`;
	}

	getDistance(miles: number) {
		const km = miles * 1.609;
		if (km < 1) {
			return `${Math.round(km * 1000)} m`;
		}

		return `${this.formatNumber(km)} km`;
	}

	getFreeDeliveryAmount(restaurant: LieferandoRestaurant) {
		if (this.isClosed(restaurant)) {
			return '';
		}

		const costs = restaurant.deliveryCosts.costs;
		if (costs.from === 0 && costs.to !== 0) {
			return `Gratis Lieferung ab ${this.formatNumber(costs.to)}€`;
		} else if (costs.from > 0) {
			return `Gratis Lieferung unter ${this.formatNumber(costs.from)}€ und über ${this.formatNumber(costs.to)}€`;
		}

		return '';
	}

	getMinCosts(deliveryCosts: DeliveryCosts) {
		if (deliveryCosts.minimumAmount === 0) {
			return 'Kein Mindestbestellwert';
		}

		return `Min. ${this.formatNumber(deliveryCosts.minimumAmount / 100)}€`;
	}

	formatNumber(number: number) {
		const userLocale = navigator.language; // Automatically detect user's locale
		return new Intl.NumberFormat(userLocale, {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2
		}).format(number);
	}

	async upvote(restaurant: Restaurant, lieferando: boolean) {
		// if user already upvoted remove vote
		if (this.isActive(restaurant.upvotes)) {
			this.removeVote(restaurant.id);
			return;
		}

		this.restaurantService.upvote(restaurant.id, restaurant.name, lieferando).subscribe({
			next: (response) => {
				// nothing
			},
			error: (error) => {
				this.handleError(error);
			}
		});
	}

	async downvote(restaurant: Restaurant, lieferando: boolean) {
		// if user already downvoted remove vote
		if (this.isActive(restaurant.downvotes)) {
			this.removeVote(restaurant.id);
			return;
		}

		this.restaurantService.downvote(restaurant.id, restaurant.name, lieferando).subscribe({
			next: (response) => {
				// nothing
			},
			error: (error) => {
				this.handleError(error);
			}
		});
	}

	removeVote(restaurantId: string) {
		this.restaurantService.removeVote(restaurantId).subscribe({
			next: (response) => {
				// nothing
			},
			error: (error) => {
				this.handleError(error);
			}
		});
	}

	sortRestaurants() {
		this.filteredCustomRestaurants = [...this.filteredCustomRestaurants].sort((a, b) => {
			const aVotes = a.votes ?? 0;
			const bVotes  = b.votes ?? 0;
			if (aVotes > bVotes) return -1;
			if (aVotes < bVotes) return 1;

			return a.name.localeCompare(b.name)
		});
		this.filteredLieferandoRestaurants = [...this.filteredLieferandoRestaurants].sort((a, b) => {
			const aVotes = a.votes ?? 0;
			const bVotes  = b.votes ?? 0;
			if (aVotes > bVotes) return -1;
			if (aVotes < bVotes) return 1;

			if (a.new && !b.new) return -1;
			if (!a.new && b.new) return 1;

			const rating = b.rating.localeCompare(a.rating);
			if (rating !== 0) {
				return rating;
			}

			if (a.ratingCount < b.ratingCount) return 1;
			if (a.ratingCount > b.ratingCount) return -1;

			return 0;
		});
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

	async getAllKitchens(): Promise<Kitchen[]> {
		return new Promise((resolve, reject) => {
			this.restaurantService.getAllKitchens().subscribe({
				next: (kitchens: Kitchen[]) => {
					resolve(kitchens);
				},
				error: (error: any) => {
					this.handleError(error);
					reject(error);
				}
			});
		});
	}

	async getCurrentlyUsedKitchens() {
		const allKitchens = await this.getAllKitchens();

		// Create a map of subkitchens by their ID
		const subKitchenMap: { [key: number]: SubKitchen } = {};
		allKitchens.forEach(kitchen => {
			kitchen.subkitchens.forEach(subKitchen => {
				subKitchenMap[subKitchen.id] = subKitchen;
			});
		});

		// Create a map to track which subkitchens are used
		const usedSubKitchens: { [key: number]: boolean } = {};
		[...this.customRestaurants, ...this.lieferandoRestaurants].forEach(restaurant => {
			restaurant.subkitchens.forEach(subKitchen => {
				usedSubKitchens[subKitchen.id] = true;
			});
		});

		// Create the result array with filtered subkitchens
		const kitchens: Kitchen[] = allKitchens.map(kitchen => {
			const filteredSubKitchens = kitchen.subkitchens.filter(subKitchen => usedSubKitchens[subKitchen.id]);
			return {
				...kitchen,
				subkitchens: filteredSubKitchens
			};
		}).filter(kitchen => kitchen.subkitchens.length > 0); // Remove kitchens with empty subkitchens

		this.kitchens = kitchens;
		this.kitchenFilter = kitchens.reduce((prev: any, curr) => {
			prev[curr.id] = {
				description_de: curr.description_de,
				description_en: curr.description_en,
				checked: true,
				subkitchens: curr.subkitchens.reduce((prev: any, curr) => {
					prev[curr.id] = {
						description_de: curr.description_de,
						description_en: curr.description_en,
						checked: true
					};

					return prev;
				}, {})
			};

			return prev;
		}, {});
	}

	async getAllRestaurants() {
		const customRestaurantsPromise = new Promise((resolve, reject) => {
			this.restaurantService.getAllCustomRestaurants().subscribe({
				next: (restaurants: CustomRestaurant[]) => {
					this.customRestaurants = restaurants;
					this.filteredCustomRestaurants = Object.assign([], restaurants);
					resolve(restaurants);
				},
				error: (error: any) => {
					this.handleError(error);
					reject(error);
				}
			});
		});

		const lieferandoRestaurantsPromise = new Promise((resolve, reject) => {
			this.restaurantService.getAllLieferandoRestaurants('deg').subscribe({
				next: (restaurants: LieferandoRestaurant[]) => {
					this.lieferandoRestaurants = restaurants;
					this.filteredLieferandoRestaurants = Object.assign([], restaurants);
					resolve(restaurants);
				},
				error: (error: any) => {
					this.handleError(error);
					reject(error);
				}
			});
		});

		await Promise.all([customRestaurantsPromise, lieferandoRestaurantsPromise]);
		this.updateFilteredRestaurants();
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
		this.filteredCustomRestaurants = Object.assign([], this.customRestaurants);
		this.filteredLieferandoRestaurants = Object.assign([], this.filteredLieferandoRestaurants);
		this.updateSubkitchenRestaurantFilter(this.kitchens.map((k) => k.id));

		if (!this.searchText) {
			return;
		}

		const searchText = this.searchText.toLowerCase();
		const filterFn = (restaurant: Restaurant) => {
			return restaurant.name.toLowerCase().includes(searchText)
				|| restaurant.city.toLowerCase().includes(searchText)
				|| restaurant.street.toLowerCase().includes(searchText)
				|| restaurant.subkitchens.join(' ').toLowerCase().includes(searchText);
		};

		this.filteredCustomRestaurants = this.filteredCustomRestaurants.filter(filterFn);
		this.filteredLieferandoRestaurants = this.filteredLieferandoRestaurants.filter(filterFn);

		this.sortRestaurants();
	}
}
