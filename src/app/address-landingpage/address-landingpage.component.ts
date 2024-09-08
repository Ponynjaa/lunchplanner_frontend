import { Component } from '@angular/core';
import { AddressPickerComponent } from '../address-picker/address-picker.component';
import { HeaderComponent } from '../header/header.component';
import { Suggestion } from '../models/address';
import { Router } from '@angular/router';

@Component({
	selector: 'app-address-landingpage',
	standalone: true,
	imports: [HeaderComponent, AddressPickerComponent],
	templateUrl: './address-landingpage.component.html',
	styleUrl: './address-landingpage.component.scss'
})
export class AddressLandingpageComponent {
	constructor (
		private router: Router
	) {}

	onAddressSelected(suggestion: Suggestion) {
		console.log(suggestion);
		localStorage.setItem('location', JSON.stringify(suggestion));
		this.router.navigate(['/']);
	}
}
