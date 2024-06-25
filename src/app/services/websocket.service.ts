import { Injectable } from '@angular/core';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';

@Injectable({
	providedIn: 'root',
})
export class WebSocketService {
	private readonly backendUrl = 'localhost:3000';

	constructor() { }

	connect(token: string): WebSocketSubject<any> {
		return webSocket(`ws://${this.backendUrl}?token=${token}`);
	}
}
