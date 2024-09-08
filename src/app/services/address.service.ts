import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Suggestion } from '../models/address';
import { Observable, of } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class AddressService {
	private readonly backendUrl = 'http://localhost:3000/api/v1';
	// private readonly backendUrl = '/api/v1';

	constructor(private http: HttpClient) { }

	getLocationByAddress(query: string, countryCode: string): Observable<Suggestion[]> {
		if (query.trim() === '') {
			return of([]);
		}

		return this.http.get<Suggestion[]>(`${this.backendUrl}/address/getLocationByAddress?query=${encodeURIComponent(query)}&countryCode=${countryCode}`);
	}
}
