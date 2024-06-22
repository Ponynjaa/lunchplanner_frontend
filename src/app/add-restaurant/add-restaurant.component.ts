import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
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

interface NewRestaurant {
	name: string;
	city: string;
	street: string;
	logo: File | null;
	delivery: boolean;
	pickup: boolean;
	subkitchens: SubKitchen[];
};

@Component({
	selector: 'app-add-restaurant',
	standalone: true,
	imports: [HeaderComponent, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule, AsyncPipe, MatChipsModule, MatIconModule, MatButtonModule, MatCheckboxModule],
	templateUrl: './add-restaurant.component.html',
	styleUrl: './add-restaurant.component.scss'
})
export class AddRestaurantComponent implements OnInit {
	@ViewChild('kitchenInput') kitchenInput!: ElementRef<HTMLInputElement>;

	private _restaurantLogoLabel!: ElementRef<HTMLLabelElement>;
	@ViewChild('restaurantLogoLabel')
	set restaurantLogoLabel(restaurantLogoLabel: ElementRef<HTMLLabelElement>) {
		// restaurantLogoLabel.nativeElement.style.backgroundImage = `url('${this.imageUrl}')`;
		this._restaurantLogoLabel = restaurantLogoLabel;
	}
	get restaurantLogoLabel(): ElementRef<HTMLLabelElement> {
		return this._restaurantLogoLabel;
	}

	kitchens: Kitchen[] = [];
	restaurantForm = this._formBuilder.group({
		kitchen: {
			id: 0,
			description_de: '',
			description_en: ''
		},
		name: '',
		city: '',
		street: '',
		delivery: false,
		pickup: false
	});
	filteredKitchens: Kitchen[] = [];

	restaurant: NewRestaurant = {
		name: '',
		city: '',
		street: '',
		logo: null,
		delivery: false,
		pickup: false,
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

		this.registerValueChangeHandler(['name', 'city', 'street', 'pickup', 'delivery']);
	}

	registerValueChangeHandler(keys: Array<keyof NewRestaurant>) {
		for (const key of keys) {
			this.restaurantForm.get(key)!.valueChanges.subscribe({
				next: (value) => {
					if (value !== null) {
						this.restaurant[key] = value as never;
					}
				}
			});
		}
	}

	onFileSelected(event: Event): void {
		const fileInput = event.target as HTMLInputElement;
		if (fileInput.files && fileInput.files.length > 0) {
			this.restaurant.logo = fileInput.files[0];
			const imageUrl = URL.createObjectURL(this.restaurant.logo);
			this.restaurantLogoLabel.nativeElement.style.backgroundImage = `url('${imageUrl}')`;
		}
	}

	addRestaurant() {
		console.log(this.restaurant);

		if (!this.restaurant.logo || this.restaurant.subkitchens.length === 0) {
			const msg = !this.restaurant.logo ? 'Logo is missing' : 'At least one kitchen is required';
			const error = new Error(msg);
			this.handleError(error);
			return;
		}

		const subkitchens = this.restaurant.subkitchens.map((subkitchen) => subkitchen.id);
		this.restaurantService.addCustomRestaurant(this.restaurant.name, this.restaurant.city, this.restaurant.street, subkitchens, this.restaurant.delivery, this.restaurant.pickup, this.restaurant.logo).subscribe({
			next: (response) => {
				console.log(response);
			},
			error: (error) => {
				this.handleError(error);
			}
		})
	}

	private async getAllKitchens() {
		this.restaurantService.getAllKitchens().subscribe({
			next: (kitchens: Kitchen[]) => {
				this.kitchens = kitchens;
				this.filteredKitchens = Object.assign([], kitchens);
			},
			error: (error) => {
				this.handleError(error);
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
		console.error(error);
		this.displayError(error.message);
	}

	private displayError(message: string) {
		this.snackBar.open(message, 'Close', { duration: 5000 });
	}

	displayWith(subkitchen: SubKitchen): string {
		return subkitchen ? subkitchen.description_de : '';
	}
}
