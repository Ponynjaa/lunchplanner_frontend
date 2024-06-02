import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class ImageService {
	private readonly backendUrl = 'http://localhost:3000/api/v1/user';
	// private readonly backendUrl = '/api/v1';
	constructor(private http: HttpClient) { }

	getUserImage(userId: string): Observable<Blob> {
		return this.http.get(`${this.backendUrl}/getUserImage?userId=${userId}`, { responseType: 'blob' });
	}

	createImageFromBlob(image: Blob): Promise<string|ArrayBuffer|null> {
		return new Promise((resolve, reject) => {
			let reader = new FileReader();
			reader.addEventListener("load", () => {
				resolve(reader.result);
			}, false);

			if (image) {
				reader.readAsDataURL(image);
			} else {
				reject();
			}
		});
	}

	uploadFile(file: File) {
		const formData = new FormData();
		formData.append('image', file);
	
		return this.http.post(`${this.backendUrl}/uploadUserImage`, formData);
	}
}
