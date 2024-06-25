import { KeycloakProfile } from 'keycloak-js';

export interface UserProfile extends KeycloakProfile {
	userImage?: string;
}
