import { KeycloakProfile } from 'keycloak-js';

export interface UserProfile extends KeycloakProfile {
	userImage?: string;
}

export interface User {
	id: number;
	keycloak_id?: string;
	first_name: string;
	last_name: string;
	image: string;
}
