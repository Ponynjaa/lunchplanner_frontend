import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Injectable({
	providedIn: 'root'
})
export class KeycloakOperationService {
	constructor(private readonly keycloak: KeycloakService) { }

	isLoggedIn() {
		return this.keycloak.isLoggedIn();
	}
	async logout() {
		this.keycloak.logout();
	}
	async getUserProfile() {
		return this.keycloak.loadUserProfile();
	}
	async getToken() {
		return this.keycloak.getToken();
	}
}
