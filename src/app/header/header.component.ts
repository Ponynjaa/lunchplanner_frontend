import { Component, OnInit } from '@angular/core';
import { KeycloakOperationService } from '../services/keycloak.service';
import { RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ImageService } from '../services/image.service';
import { MatDialog } from '@angular/material/dialog';
import { KeycloakProfile } from 'keycloak-js';
import { UserProfile } from '../models/user';
import { UserProfileDialogComponent } from '../user-profile-dialog/user-profile-dialog.component';

@Component({
	selector: 'app-header',
	standalone: true,
	imports: [RouterModule, MatMenuModule, MatButtonModule, MatIconModule],
	templateUrl: './header.component.html',
	styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
	userProfile?: UserProfile;

	constructor(private keycloakService: KeycloakOperationService, private imageService: ImageService, public dialog: MatDialog) { }

	ngOnInit() {
		this.keycloakService.getUserProfile().then((data: KeycloakProfile) => {
			this.userProfile = data;
			this.imageService.getUserImage(this.userProfile.id!).subscribe({
				next: async (value) => {
					this.userProfile!.userImage = await this.imageService.createImageFromBlob(value);
				}
			});
		});
	}

	openProfileDialog() {
		const dialogRef = this.dialog.open(UserProfileDialogComponent, {
			data: { userProfile: this.userProfile },
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result.userImage) {
				this.userProfile!.userImage = result.userImage;
			}
		});
	}

	logout() {
		this.keycloakService.logout();
	}
}
