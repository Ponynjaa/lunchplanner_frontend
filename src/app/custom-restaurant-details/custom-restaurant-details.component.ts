import { Component, OnDestroy, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { ActivatedRoute } from '@angular/router';
import { CustomRestaurant } from '../models/restaurant';
import { RestaurantService } from '../services/restaurant.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
	selector: 'app-custom-restaurant-details',
	standalone: true,
	imports: [HeaderComponent],
	templateUrl: './custom-restaurant-details.component.html',
	styleUrl: './custom-restaurant-details.component.scss'
})
export class CustomRestaurantDetailsComponent implements OnInit, OnDestroy {
	restaurant!: CustomRestaurant;
	pdf!: any;
	private sub: any;

	constructor(private route: ActivatedRoute, private restaurantService: RestaurantService, private sanitizer: DomSanitizer) { }

	ngOnInit() {
		this.sub = this.route.params.subscribe(params => {
			const id = params['id'];
			this.getRestaurantDetails(id);
		});
	}

	getRestaurantDetails(id: string) {
		this.restaurantService.getCustomRestaurantDetails(id).subscribe({
			next: (restaurant) => {
				this.restaurant = restaurant;
				this.pdf = this.sanitizer.bypassSecurityTrustResourceUrl(restaurant.menuurl);
				console.log(restaurant);
			}
		});
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}
}
