import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Kitchen, Restaurant } from '../models/restaurant';

@Injectable({
	providedIn: 'root',
})
export class RestaurantService {
	private readonly backendUrl = 'http://localhost:3000/api/v1';
	constructor(private http: HttpClient) { }

	getAllRestaurants(): Observable<Array<Restaurant>> {
		return this.http.get<Array<Restaurant>>(`${this.backendUrl}/getAllRestaurants`);
	}
	getRestaurantById(id: number): Observable<Restaurant> {
		return this.http.get<Restaurant>(`${this.backendUrl}/getRestaurantById/${id}`);
	}
	getAllKitchens(): Observable<Array<Kitchen>> {
		return this.http.get<Array<Kitchen>>(`${this.backendUrl}/getAllKitchens`);
	}
	getCurrentlyUsedKitchens(): Observable<Array<Kitchen>> {
		return this.http.get<Array<Kitchen>>(`${this.backendUrl}/getCurrentlyUsedKitchens`);
	}
}
