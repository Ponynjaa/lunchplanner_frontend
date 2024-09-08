import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import {
	MatDialog,
	MAT_DIALOG_DATA,
	MatDialogRef,
	MatDialogTitle,
	MatDialogContent,
	MatDialogActions,
	MatDialogClose,
} from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { catchError, of } from 'rxjs';
import { ImageService } from '../services/image.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
	selector: 'app-user-profile-dialog',
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
		MatDialogClose
	],
	templateUrl: './user-profile-dialog.component.html',
	styleUrl: './user-profile-dialog.component.scss'
})
export class UserProfileDialogComponent {
	private _userImageLabel!: ElementRef<HTMLLabelElement>;
	@ViewChild('userImageLabel')
	set userImageLabel(userImageLabel: ElementRef<HTMLLabelElement>) {
		userImageLabel.nativeElement.style.backgroundImage = `url('${this.imageUrl}')`;
		this._userImageLabel = userImageLabel;
	}
	get userImageLabel(): ElementRef<HTMLLabelElement> {
		return this._userImageLabel;
	}

	selectedFile?: File;
	imageUrl: string = '';

	constructor(
		public dialogRef: MatDialogRef<UserProfileDialogComponent>,
		private imageService: ImageService,
		private snackBar: MatSnackBar,
		@Inject(MAT_DIALOG_DATA) public data: any,
	) {
		this.imageUrl = this.data?.userProfile?.userImage ?? '';
	}

	onFileSelected(event: Event): void {
		const fileInput = event.target as HTMLInputElement;
		if (fileInput.files && fileInput.files.length > 0) {
			this.selectedFile = fileInput.files[0];
			this.imageUrl = URL.createObjectURL(this.selectedFile);
			this.userImageLabel.nativeElement.style.backgroundImage = `url('${this.imageUrl}')`;
		}
	}

	saveChanges(): void {
		if (this.selectedFile) {
			this.imageService.uploadFile(this.selectedFile)
				.pipe(
					catchError(error => {
						return of({ errorMessage: 'File upload failed.', error: error });
					})
				)
				.subscribe((response: any) => {
					if (response.errorMessage || !response.success) {
						console.error(response.error);
						this.snackBar.open(response.errorMessage, 'Ok', {
							panelClass: ['snackbar-status', 'snackbar-failure']
						});
						return;
					}

					this.snackBar.open('Settings successfully saved.', undefined, {
						panelClass: ['snackbar-status', 'snackbar-success'],
						duration: 2000
					});

					this.dialogRef.close({ userImage: this.imageUrl });
				});
		}
	}
}
