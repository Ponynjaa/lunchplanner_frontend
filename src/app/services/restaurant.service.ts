import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CustomRestaurant, Kitchen, LieferandoRestaurant, Restaurant } from '../models/restaurant';

@Injectable({
	providedIn: 'root',
})
export class RestaurantService {
	private readonly backendUrl = 'http://localhost:3000/api/v1';
	// private readonly backendUrl = '/api/v1';

	private readonly coords = {
		deg: {
			postalCode: "94469",
			latitude: "48.83875",
			longitude: "12.94523"
		},
		muc: {
			postalCode: "80809",
			latitude: "48.170200",
			longitude: "11.564700"
		}
	};

	constructor(private http: HttpClient) { }

	upvote(restaurantId: string, restaurantName: string, lieferando: boolean) {
		return this.http.post(`${this.backendUrl}/restaurant/upvote`, { restaurantId, restaurantName, lieferando });
	}
	downvote(restaurantId: string, restaurantName: string, lieferando: boolean) {
		return this.http.post(`${this.backendUrl}/restaurant/downvote`, { restaurantId, restaurantName, lieferando });
	}
	getAllCustomRestaurants(): Observable<Array<CustomRestaurant>> {
		return this.http.get<Array<CustomRestaurant>>(`${this.backendUrl}/restaurant/getAllCustomRestaurants`);
	}
	addCustomRestaurant(name: string, city: string, street: string, subkitchensIds: number[], delivery: boolean, pickup: boolean, logo: Blob) {
		const formData = new FormData();
		formData.append('image', logo);
		formData.append('name', name);
		formData.append('city', city);
		formData.append('street', street);
		formData.append('subkitchenIds', JSON.stringify(subkitchensIds));
		formData.append('delivery', JSON.stringify(delivery));
		formData.append('pickup', JSON.stringify(pickup));

		return this.http.post(`${this.backendUrl}/restaurant/addCustomRestaurant`, formData);
	}
	getCustomRestaurantDetails(id: number): Observable<CustomRestaurant> {
		return this.http.get<CustomRestaurant>(`${this.backendUrl}/restaurant/getCustomRestaurantDetails?id=${id}`);
	}
	getAllLieferandoRestaurants(place: 'deg'|'muc'): Observable<Array<LieferandoRestaurant>> {
		return this.http.get<Array<LieferandoRestaurant>>(`${this.backendUrl}/restaurant/getAllLieferandoRestaurants?postalCode=${this.coords[place].postalCode}&latitude=${this.coords[place].latitude}&longitude=${this.coords[place].longitude}`);
	}
	getAllKitchens(): Observable<Array<Kitchen>> {
		return this.http.get<Array<Kitchen>>(`${this.backendUrl}/restaurant/getAllKitchens`);
	}
}
