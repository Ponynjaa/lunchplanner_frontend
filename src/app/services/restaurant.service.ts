import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Kitchen, LieferandoRestaurant, Restaurant } from '../models/restaurant';

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

	getAllCustomRestaurants(): Observable<Array<Restaurant>> {
		return this.http.get<Array<Restaurant>>(`${this.backendUrl}/restaurant/getAllCustomRestaurants`);
	}
	getAllLieferandoRestaurants(): Observable<Array<LieferandoRestaurant>> {
		return this.http.get<Array<LieferandoRestaurant>>(`${this.backendUrl}/restaurant/getAllLieferandoRestaurants?postalCode=${this.coords.muc.postalCode}&latitude=${this.coords.muc.latitude}&longitude=${this.coords.muc.longitude}`);
	}
	getCustomRestaurantDetails(id: number): Observable<Restaurant> {
		return this.http.get<Restaurant>(`${this.backendUrl}/restaurant/getCustomRestaurantDetails?id=${id}`);
	}
	getAllKitchens(): Observable<Array<Kitchen>> {
		return this.http.get<Array<Kitchen>>(`${this.backendUrl}/restaurant/getAllKitchens`);
	}
	getCurrentlyUsedKitchens(): Observable<Array<Kitchen>> {
		return this.http.get<Array<Kitchen>>(`${this.backendUrl}/restaurant/getCurrentlyUsedKitchens`);
	}
}
