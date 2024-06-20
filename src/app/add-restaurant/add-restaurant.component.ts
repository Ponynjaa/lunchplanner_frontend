import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RestaurantService } from '../services/restaurant.service';
import { Restaurant, Kitchen, SubKitchen, OrderMethod } from '../models/restaurant';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { HeaderComponent } from '../header/header.component';

export const _subkitchenFilter = (opt: SubKitchen[], value: string): SubKitchen[] => {
	const filterValue = value.toLowerCase();

	return opt.filter(item => item.description_de.toLowerCase().includes(filterValue));
};

@Component({
	selector: 'app-add-restaurant',
	standalone: true,
	imports: [HeaderComponent, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule, AsyncPipe, MatChipsModule, MatIconModule, MatButtonModule],
	templateUrl: './add-restaurant.component.html',
	styleUrl: './add-restaurant.component.scss'
})
export class AddRestaurantComponent implements OnInit {
	@ViewChild('kitchenInput') kitchenInput!: ElementRef<HTMLInputElement>;

	kitchens: Kitchen[] = [];
	restaurantForm = this._formBuilder.group({
		kitchen: {
			id: 0,
			description_de: '',
			description_en: ''
		},
		name: '',
		street: '',
		city: ''
	});
	filteredKitchens: Kitchen[] = [];

	restaurant: Restaurant = {
		id: 0,
		name: '',
		city: '',
		street: '',
		logourl: '',
		deliveryMethods: {
			orderMethods: OrderMethod.PICKUP,
			delivery: {
				open: 0,
				orderAhead: ''
			},
			pickup: {
				open: 0,
				orderAhead: ''
			}
		},
		subkitchens: []
	};

	constructor(private _formBuilder: FormBuilder, private restaurantService: RestaurantService, private snackBar: MatSnackBar) { }

	ngOnInit() {
		this.getAllKitchens();
		this.restaurantForm.get('kitchen')!.valueChanges.subscribe({
			next: (subkitchen: SubKitchen | null) => {
				if (subkitchen !== null) {
					if (!this.restaurant.subkitchens.includes(subkitchen)) {
						this.restaurant.subkitchens.push(subkitchen);
					}
				}
			}
		});
		this.restaurantForm.get('name')!.valueChanges.subscribe({
			next: (name: string | null) => {
				if (name !== null) {
					this.restaurant.name = name;
				}
			}
		});
		this.restaurantForm.get('city')!.valueChanges.subscribe({
			next: (city: string | null) => {
				if (city !== null) {
					this.restaurant.city = city;
				}
			}
		});
		this.restaurantForm.get('street')!.valueChanges.subscribe({
			next: (street: string | null) => {
				if (street !== null) {
					this.restaurant.street = street;
				}
			}
		});
	}

	addRestaurant() {
		console.log(this.restaurant);
	}

	private async getAllKitchens() {
		this.restaurantService.getAllKitchens().subscribe({
			next: (kitchens: Kitchen[]) => {
				this.kitchens = kitchens;
				this.filteredKitchens = Object.assign([], kitchens);
			},
			error: (error: any) => {
				this.handleError(error.error);
			}
		});
	}

	removeSubkitchen(subkitchen: SubKitchen) {
		const index = this.restaurant.subkitchens.indexOf(subkitchen);

		if (index >= 0) {
			this.restaurant.subkitchens.splice(index, 1);
		}
	}

	filterKitchens() {
		const value = this.kitchenInput.nativeElement.value.toLowerCase();
		if (value) {
			this.filteredKitchens = this.kitchens
				.map(kitchen => ({ id: kitchen.id, description_de: kitchen.description_de, description_en: kitchen.description_en, subkitchens: _subkitchenFilter(kitchen.subkitchens, value) }))
				.filter(kitchen => kitchen.subkitchens.length > 0);
			return;
		}

		this.filteredKitchens = Object.assign([], this.kitchens);
	}

	private handleError(error: any) {
		this.displayError(error.code + ' ' + error.reason + '. ' + error.message);
	}

	private displayError(message: string) {
		this.snackBar.open(message, 'Close', { duration: 5000 });
	}

	displayWith(subkitchen: SubKitchen): string {
		return subkitchen ? subkitchen.description_de : '';
	}
}
