import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const addressGuard: CanActivateFn = (route, state) => {
	const location = localStorage.getItem('location');
	if (location) {
		return true;
	}

	return inject(Router).createUrlTree(['/address']);
};
