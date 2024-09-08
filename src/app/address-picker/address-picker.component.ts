import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AddressService } from '../services/address.service';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';
import { Suggestion } from '../models/address';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { OverlayModule } from '@angular/cdk/overlay';

@Component({
	selector: 'address-picker',
	standalone: true,
	imports: [CommonModule, FormsModule, MatIconModule, MatFormFieldModule, MatSelectModule, MatInputModule, OverlayModule],
	templateUrl: './address-picker.component.html',
	styleUrl: './address-picker.component.scss'
})
export class AddressPickerComponent implements OnInit {
	@Output() addressSelected = new EventEmitter<Suggestion>();
	@ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

	suggestions!: Suggestion[];
	private searchText = new Subject<string>();

	suggestionsOverlayOpen = false;

	// TODO: maybe use IP API to set this to the most probable country depending on the IP address of the user
	countryCode = 'de';
	countries = [
		{
			"code": "at",
			"name": "Austria"
		},
		{
			"code": "au",
			"name": "Australia"
		},
		{
			"code": "be",
			"name": "Belgium"
		},
		{
			"code": "bg",
			"name": "Bulgaria"
		},
		{
			"code": "ca",
			"name": "Canada"
		},
		{
			"code": "ch",
			"name": "Switzerland"
		},
		{
			"code": "de",
			"name": "Germany"
		},
		{
			"code": "dk",
			"name": "Denmark"
		},
		{
			"code": "es",
			"name": "Spain"
		},
		{
			"code": "fr",
			"name": "France"
		},
		{
			"code": "gb",
			"name": "United Kingdom"
		},
		{
			"code": "ie",
			"name": "Ireland"
		},
		{
			"code": "il",
			"name": "Israel"
		},
		{
			"code": "it",
			"name": "Italy"
		},
		{
			"code": "lu",
			"name": "Luxembourg"
		},
		{
			"code": "nl",
			"name": "Netherlands"
		},
		{
			"code": "pl",
			"name": "Poland"
		},
		{
			"code": "sk",
			"name": "Slovakia"
		},
		{
			"code": "us",
			"name": "United States of America"
		}
	];

	constructor(
		private addressService: AddressService
	) { }

	onSearchBarClick() {
		this.suggestionsOverlayOpen = true;
	}

	getValue(event: Event): string {
		return (event.target as HTMLInputElement).value;
	}

	search(searchText: string) {
		this.searchText.next(searchText);
		this.suggestionsOverlayOpen = true;
	}

	pickAddress(suggestion: Suggestion) {
		this.addressSelected.emit(suggestion);

		this.searchInput.nativeElement.value = suggestion.full_address;
		this.suggestionsOverlayOpen = false;
	}

	ngOnInit() {
		this.searchText.pipe(
			debounceTime(500),
			distinctUntilChanged(),
			switchMap((address) => {
				return this.addressService.getLocationByAddress(address, this.countryCode);
			})
		).subscribe((suggestions: Suggestion[]) => {
			this.suggestions = suggestions;
		});
	}
}
