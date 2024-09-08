import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { User, UserProfile } from '../../models/user';
import { GroupService } from '../../services/group.service';
import { Group } from '../../models/group';
import { ImageService } from '../../services/image.service';

@Component({
	selector: 'app-group-dialog',
	standalone: true,
	imports: [
		MatSnackBarModule,
		MatFormFieldModule,
		MatInputModule,
		FormsModule,
		MatButtonModule,
		MatDialogTitle,
		MatDialogContent,
		MatDialogActions,
		MatDialogClose,
		MatIconModule,
		MatTooltipModule
	],
	templateUrl: './group-dialog.component.html',
	styleUrl: './group-dialog.component.scss'
})
export class GroupDialogComponent implements OnInit {
	private _newGroupImageLabel!: ElementRef<HTMLLabelElement>;
	@ViewChild('newGroupImageLabel')
	set newGroupImageLabel(newGroupImageLabel: ElementRef<HTMLLabelElement>) {
		this._newGroupImageLabel = newGroupImageLabel;
		this.setInitialImageUrl();
	}
	get newGroupImageLabel(): ElementRef<HTMLLabelElement> {
		return this._newGroupImageLabel;
	}

	newGroupName: string = '';

	newGroupImage?: Blob;
	newGroupImageUrl?: string;

	userProfile: UserProfile;
	currentGroups!: Group[];
	groups!: Group[];
	mastergroups: Group[];

	inviteLink?: string;

	constructor(
		public dialogRef: MatDialogRef<GroupDialogComponent>,
		private snackBar: MatSnackBar,
		private groupService: GroupService,
		private imageService: ImageService,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {
		this.userProfile = this.data?.userProfile;
		this.mastergroups = [];
	}

	ngOnInit() {
		this.groupService.getGroups().subscribe({
			next: (groups) => {
				this.groups = groups;
				this.currentGroups = this.groups;
			}
		});
	}

	private setInitialImageUrl() {
		this.newGroupImageLabel.nativeElement.style.backgroundImage = `url(/assets/add_image_icon.svg)`;
	}

	onFileSelected(event: Event) {
		const fileInput = event.target as HTMLInputElement;
		if (fileInput.files && fileInput.files.length > 0) {
			this.newGroupImage = fileInput.files[0];
			this.newGroupImageUrl = URL.createObjectURL(this.newGroupImage);
			this.newGroupImageLabel.nativeElement.style.backgroundImage = `url('${this.newGroupImageUrl}')`;
		}
	}

	editImage(event: Event, group: Group) {
		event.stopPropagation();

		const input = document.createElement('input');
		input.type = 'file';
		input.accept = 'image/*';
		input.onchange = (event) => {
			const fileInput = event.target as HTMLInputElement;
			if (fileInput.files && fileInput.files.length > 0) {
				const selectedFile = fileInput.files[0];
				this.groupService.editImage(group.id, selectedFile).subscribe({
					next: async (value) => {
						group.image = await this.imageService.createImageFromBlob(selectedFile);
					}
				});
			}
		}
		input.click();
	}

	removeUserFromGroup(event: Event, user: User) {
		event.stopPropagation();

		const group = this.mastergroups[this.mastergroups.length - 1];
		console.log(`User ${user.first_name} should be kicked from ${group.name}`);
	}

	generateInviteLink() {
		const group = this.mastergroups[this.mastergroups.length - 1];

		this.groupService.getInviteLink(group.id).subscribe({
			next: (response) => {
				this.inviteLink = `${location.origin}/groups/join/${response.code}`;
			}
		});
	}

	onInviteInputFocus(event: Event) {
		(event.target as HTMLInputElement).select();
	}

	copyLink() {
		if (this.inviteLink) {
			navigator.clipboard.writeText(this.inviteLink);
		}
	}

	createGroup() {
		if (!this.newGroupName) {
			this.snackBar.open('No group-name specified!', undefined, { duration: 2000 });
			return;
		}

		this.groupService.createGroup(this.newGroupName, this.mastergroups[this.mastergroups.length - 1]?.id, this.newGroupImage).subscribe({
			next: (data) => {
				const createdGroup = data.createdGroup;
				this.currentGroups.push(createdGroup);

				// clear inputs
				this.newGroupName = '';
				delete this.newGroupImage;
				delete this.newGroupImageUrl;
				this.setInitialImageUrl();
			}
		});
	}

	deleteGroup(event: Event, group: Group) {
		event.stopPropagation();

		this.groupService.deleteGroup(group.id).subscribe({
			next: (value) => {
				const index = this.currentGroups.findIndex((currentGroup) => currentGroup.id === group.id);
				this.currentGroups.splice(index, 1);
			}
		});
	}

	showSubgroups(group?: Group) {
		if (!group) {
			this.currentGroups = this.groups;
			this.mastergroups = [];
			return;
		}

		const index = this.mastergroups.findIndex((mastergroup) => mastergroup.id === group.id);
		if (index === -1) {
			this.mastergroups.push(group);
		} else {
			this.mastergroups.splice(index + 1);
		}

		this.currentGroups = group.subgroups;
	}

}
