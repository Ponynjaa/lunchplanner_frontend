import { KeycloakService } from 'keycloak-angular';

export function initializeKeycloak(keycloak: KeycloakService) {
	return () =>
		keycloak.init({
			config: {
				url: 'https://keycloak.oliverswienty.de',
				realm: 'Xpublisher',
				clientId: 'lunchplanner',
			},
			enableBearerInterceptor: true,
			bearerPrefix: 'Bearer',
			bearerExcludedUrls: ['/assets'],
			initOptions: {
				onLoad: 'check-sso',
				silentCheckSsoRedirectUri:
					window.location.origin + '/assets/silent-check-sso.html',
			},
		});
}
