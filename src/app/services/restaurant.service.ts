import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CustomRestaurant, Kitchen, LieferandoRestaurant, Restaurant, RestaurantType } from '../models/restaurant';

@Injectable({
	providedIn: 'root',
})
export class RestaurantService {
	private readonly backendUrl = 'http://localhost:3000/api/v1';
	// private readonly backendUrl = '/api/v1';

	constructor(private http: HttpClient) { }

	getLocation() {
		const location = localStorage.getItem('location');
		return JSON.parse(location!);
	}

	upvote(restaurantId: string, restaurantName: string, type: RestaurantType) {
		return this.http.post(`${this.backendUrl}/restaurant/upvote`, { restaurantId, restaurantName, type });
	}
	downvote(restaurantId: string, restaurantName: string, type: RestaurantType) {
		return this.http.post(`${this.backendUrl}/restaurant/downvote`, { restaurantId, restaurantName, type });
	}
	removeVote(restaurantId: string) {
		return this.http.post(`${this.backendUrl}/restaurant/removeVote`, { restaurantId });
	}
	getAllCustomRestaurants(): Observable<Array<CustomRestaurant>> {
		const location = this.getLocation();
		return this.http.get<Array<CustomRestaurant>>(`${this.backendUrl}/restaurant/getAllCustomRestaurants?longitude=${location.longitude}&latitude=${location.latitude}`);
	}
	addCustomRestaurant(name: string, longitude: number, latitude: number, city: string, street: string, subkitchensIds: number[], delivery: boolean, pickup: boolean, logo: Blob, menu: Blob) {
		const formData = new FormData();
		formData.append('image', logo);
		formData.append('menu', menu);
		formData.append('name', name);
		formData.append('longitude', longitude.toString());
		formData.append('latitude', latitude.toString());
		formData.append('city', city);
		formData.append('street', street);
		formData.append('subkitchenIds', JSON.stringify(subkitchensIds));
		formData.append('delivery', JSON.stringify(delivery));
		formData.append('pickup', JSON.stringify(pickup));

		return this.http.post(`${this.backendUrl}/restaurant/addCustomRestaurant`, formData);
	}
	getCustomRestaurantDetails(id: string) {
		const location = this.getLocation();
		return this.http.get<CustomRestaurant>(`${this.backendUrl}/restaurant/getCustomRestaurantDetails?id=${id}&longitude=${location.longitude}&latitude=${location.latitude}`);
	}
	getCustomRestaurantPdf(id: string) {
		return this.http.get(`${this.backendUrl}/restaurant/getCustomRestaurantPdf?id=${id}`, { responseType: 'blob' });
	}
	getAllLieferandoRestaurants() {
		const location = this.getLocation();
		return this.http.get<Array<LieferandoRestaurant>>(`${this.backendUrl}/restaurant/getAllLieferandoRestaurants?postalCode=${location.postalCode}&longitude=${location.longitude}&latitude=${location.latitude}`);
	}
	getAllKitchens() {
		return this.http.get<Array<Kitchen>>(`${this.backendUrl}/restaurant/getAllKitchens`);
	}
}
