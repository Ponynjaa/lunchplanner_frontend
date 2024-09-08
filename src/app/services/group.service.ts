import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Group, InvitationInfos } from '../models/group';

@Injectable({
	providedIn: 'root',
})
export class GroupService {
	private readonly backendUrl = 'http://localhost:3000/api/v1';
	// private readonly backendUrl = '/api/v1';

	constructor(private http: HttpClient) { }

	createGroup(name: string, mastergroup?: number, image?: Blob) {
		const formData = new FormData();
		formData.append('name', name);

		if (mastergroup) {
			formData.append('mastergroup', mastergroup.toString());
		}

		if (image) {
			formData.append('image', image);
		}

		return this.http.post<{ success: boolean, createdGroup: Group }>(`${this.backendUrl}/group/createGroup`, formData);
	}
	deleteGroup(id: number) {
		return this.http.delete(`${this.backendUrl}/group/deleteGroup`, { body: { groupId: id } });
	}
	editImage(id: number, newImage: Blob) {
		const formData = new FormData();
		formData.append('image', newImage);

		return this.http.put(`${this.backendUrl}/group/editImage?id=${id}`, formData);
	}
	getGroups() {
		return this.http.get<Group[]>(`${this.backendUrl}/group/getGroups`);
	}
	getInviteLink(groupId: number) {
		return this.http.get<{ success: boolean, code: string }>(`${this.backendUrl}/group/getInviteLink?groupId=${groupId}`);
	}
	getInvitationInfos(code: string) {
		return this.http.get<InvitationInfos>(`${this.backendUrl}/group/getInvitationInfos?code=${code}`);
	}
	joinGroup(code: string) {
		return this.http.post<{ success: boolean }>(`${this.backendUrl}/group/joinGroup`, { code });
	}
}
