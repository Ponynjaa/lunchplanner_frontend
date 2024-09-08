import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
	providedIn: 'root',
})
export class WebSocketService {
	private readonly backendUrl = 'localhost:3000';

	sub?: Observable<any>;
	subject?: WebSocketSubject<any>;

	constructor() { }

	connect(sessionId: number, token: string): Observable<any> {
		this.subject = webSocket(`ws://${this.backendUrl}?token=${token}`);
		this.sub = this.subject.multiplex(
			() => ({ subscribe: sessionId }),
			() => ({ unsubscribe: sessionId }),
			(message: any) => message.sessionId === sessionId
		);
		return this.sub;
	}

	sendMessage(msg: any) {
		this.subject?.next(msg);
	}
}
